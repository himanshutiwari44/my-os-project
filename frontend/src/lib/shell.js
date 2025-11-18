// // In-memory filesystem and simple shell commands (JS port)
// /**
//  * This is the "Head Chef" function.
//  * It's the main "engine" that the frontend calls.
//  * It takes the user's command, the current path, and the entire file system object.
//  * It returns a "result" object: { output, newPath, newFileSystem }
//  */
export function executeCommand(command, currentPath, fileSystem) {
  // 1. Parse the command
  // Splits "mkdir my-folder" into cmd="mkdir" and args=["my-folder"]
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Helper to call a REAL server backend (not used by most of the in-memory commands)
  async function callApi(path, method = 'GET', body) {
    try {
      const url = new URL(`/api/fs${path}`, window.location.origin).toString();
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // 2. Decide what to do based on the command
  switch (cmd) {
    case "help":
      // Returns a simple help message for the frontend to print
      return {
        output: `Available commands:
  ls              - List directory contents
  cd [directory]  - Change directory
  mkdir [name]    - Create a new directory
  touch [name]    - Create a new file
  pwd             - Print working directory
  clear           - Clear the terminal
  help            - Show this help message`,
      };

    case "pwd":
      // "Print Working Directory" - Just returns the currentPath
      return { output: currentPath };

    case "clear":
      // Tells the frontend to clear the screen (by returning an empty output)
      // The frontend logic will see "clear" and reset its own history array.
      return { output: "", newFileSystem: fileSystem };

    case "ls": {
      // "List" - Lists the contents of the current directory
      // Get the node (folder) for the current path
      const node = getNode(fileSystem, currentPath);
      if (!node || node.type !== "directory") {
        return { output: "Error: Not a directory" };
      }

      if (!node.children || Object.keys(node.children).length === 0) {
        return { output: "" }; // Empty directory
      }

      // Loop through all children and format them into a string
      const items = Object.entries(node.children)
        .map(([name, child]) => (child.type === "directory" ? `📁 ${name}/` : `📄 ${name}`))
        .join("\n"); // Separate each item with a new line

      return { output: items };
    }

    case "cd": {
      // "Change Directory"
      if (args.length === 0) {
        return { output: "", newPath: "/" }; // 'cd' with no args goes to root
      }

      // Figure out the full, absolute path of the target directory
      const targetPath = parsePath(currentPath, args[0]);
      // Check if that path actually exists and is a directory
      const node = getNode(fileSystem, targetPath);

      if (!node) {
        return { output: `cd: ${args[0]}: No such file or directory` };
      }

      if (node.type !== "directory") {
        return { output: `cd: ${args[0]}: Not a directory` };
      }

      // Success! Return the newPath for the frontend to save in its 'cwd' state
      return { output: "", newPath: targetPath };
    }

    case "mkdir": {
      // "Make Directory"
      if (args.length === 0) {
        return { output: "mkdir: missing operand" };
      }
      const dirName = args[0];
      if (dirName.includes("/")) {
        return { output: "mkdir: invalid directory name" };
      }
      
      // ...skipping backend call for now...

      // Check if we are inside a valid directory
      const node = getNode(fileSystem, currentPath);
      if (!node || node.type !== "directory") {
        return { output: "Error: Current path is not a directory" };
      }

      // Check if a file/folder with that name already exists
      if (node.children && node.children[dirName]) {
        return { output: `mkdir: ${dirName}: File exists` };
      }

      // Create the full path for the new directory
      const newPath = currentPath === "/" ? `/${dirName}` : `${currentPath}/${dirName}`;
      // Create a *new* file system object with the new directory added
      const newFs = setNode(fileSystem, newPath, { type: "directory", children: {} });
      // Return the new file system for the frontend to save in its 'fs' state
      return { output: "", newFileSystem: newFs };
    }

    case "touch": {
      // "Create File" - (like mkdir but for a file)
      if (args.length === 0) {
        return { output: "touch: missing file operand" };
      }
      const fileName = args[0];
      if (fileName.includes("/")) {
        return { output: "touch: invalid file name" };
      }
      const node = getNode(fileSystem, currentPath);
      if (!node || node.type !== "directory") {
        return { output: "Error: Current path is not a directory" };
      }

      if (node.children && node.children[fileName]) {
        return { output: `touch: ${fileName}: File exists` };
      }

      // Create the full path for the new file
      const newPath = currentPath === "/" ? `/${fileName}` : `${currentPath}/${fileName}`;
      // Create a *new* file system object with the new file added
      const newFs = setNode(fileSystem, newPath, { type: "file" });
      // Return the new file system
      return { output: "", newFileSystem: newFs };
    }

    default:
      // If the command isn't in the switch, it's not found
      return { output: `${cmd}: command not found` };
  }
}

/**
 * Creates the starting, default file system object.
 * This is what the frontend gets when it first loads.
 */
export function createInitialFileSystem() {
  return {
    "/": {
      type: "directory",
      children: {
        home: { type: "directory", children: { user: { type: "directory", children: {} } } },
        bin: { type: "directory", children: {} },
      },
    },
  };
}

/**
 * A helper function to figure out an absolute path.
 * It handles ".." (go up), "/" (root), and relative paths.
 */
function parsePath(currentPath, targetPath) {
  if (targetPath === "/") return "/";
  if (targetPath.startsWith("/")) return targetPath; // Already absolute
  if (targetPath === "..") {
    // Go up one level
    if (currentPath === "/") return "/";
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }
  // Relative path, e.g., "my-folder"
  if (currentPath === "/") return "/" + targetPath;
  return currentPath + "/" + targetPath;
}

/**
 * A helper to "find" a file or folder (a "node") in the file system.
 * It "walks" the path to get the data.
 */
function getNode(fs, path) {
  if (path === "/") return fs["/"];
  const parts = path.split("/").filter(Boolean); // e.g., "home", "user"
  let current = fs["/"];
  for (const part of parts) {
    if (!current.children || !current.children[part]) return null; // Not found
    current = current.children[part];
  }
  return current;
}

/**
 * A helper to "write" a new file or folder to the file system.
 * It creates a *copy* of the file system to avoid changing the original.
 * This is *critical* for React state to update correctly.
 */
function setNode(fs, path, node) {
  // Create a deep copy so we don't change the original 'fs' object
  const newFs = JSON.parse(JSON.stringify(fs));
  
  if (path === "/") {
    newFs["/"] = node;
    return newFs;
  }
  const parts = path.split("/").filter(Boolean);
  let current = newFs["/"];
  // Walk the path, creating directories if they don't exist
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children) current.children = {};
    if (!current.children[parts[i]]) {
      current.children[parts[i]] = { type: "directory", children: {} };
    }
    current = current.children[parts[i]];
  }
  // Set the final node (file or directory)
  if (!current.children) current.children = {};
  current.children[parts[parts.length - 1]] = node;
  return newFs;
}

/**
 * A helper to "delete" a file or folder.
 * It also creates a deep copy to ensure immutability.
 */
export function removePath(fs, path) {
  // Create a deep copy
  const newFs = JSON.parse(JSON.stringify(fs));
  if (path === "/") throw new Error('Cannot remove root');
  
  // Find the *parent* directory
  const parts = path.split('/').filter(Boolean);
  let current = newFs['/'];
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children || !current.children[parts[i]]) throw new Error('Path not found');
    current = current.children[parts[i]];
  }
  
  // Find the target node and delete it
  if (!current.children || !current.children[parts[parts.length - 1]]) throw new Error('Path not found');
  delete current.children[parts[parts.length - 1]];
  return newFs; // Return the modified copy
}

// Export helpers so the UI can use them if needed
export { getNode, setNode };

// === ASYNC BACKEND API HELPERS ===
// These functions are for talking to a REAL server.
// They use 'fetch' to make network requests.
// They are NOT used by the main 'executeCommand' logic above.

export async function apiLs(path) {
  try {
    const res = await fetch(`/api/fs/ls?path=${encodeURIComponent(path)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.entries || [];
  } catch (err) {
    return null;
  }
}

export async function apiMkdir(path, name) {
  try {
    const res = await fetch('/api/fs/mkdir', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, name })
    });
    if (!res.ok) return { ok: false, error: 'Network error' };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ... other API functions (apiTouch, apiRm, etc.) follow the same pattern ...