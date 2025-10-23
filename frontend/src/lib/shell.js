// In-memory filesystem and simple shell commands (JS port)

export function executeCommand(command, currentPath, fileSystem) {
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // helper to call backend fs API; returns null on failure
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

  switch (cmd) {
    case "help":
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
      return { output: currentPath };

    case "clear":
      return { output: "", newFileSystem: fileSystem };

    case "ls": {
      // Try backend first (synchronous fallback using local FS is not possible because fetch is async).
      // We'll return a placeholder indicating async handling is required by caller.
      // Frontend components already call executeCommand synchronously; to keep compatibility we will
      // return a special token that the UI code can detect (not ideal). Simpler: keep existing local logic
      // if backend is not used. For now, we keep local behavior and the UI should later call API directly
      // for persistence.

      const node = getNode(fileSystem, currentPath);
      if (!node || node.type !== "directory") {
        return { output: "Error: Not a directory" };
      }

      if (!node.children || Object.keys(node.children).length === 0) {
        return { output: "" };
      }

      const items = Object.entries(node.children)
        .map(([name, child]) => (child.type === "directory" ? `📁 ${name}/` : `📄 ${name}`))
        .join("\n");

      return { output: items };
    }

    case "cd": {
      if (args.length === 0) {
        return { output: "", newPath: "/" };
      }

      const targetPath = parsePath(currentPath, args[0]);
      const node = getNode(fileSystem, targetPath);

      if (!node) {
        return { output: `cd: ${args[0]}: No such file or directory` };
      }

      if (node.type !== "directory") {
        return { output: `cd: ${args[0]}: Not a directory` };
      }

      return { output: "", newPath: targetPath };
    }

    case "mkdir": {
      if (args.length === 0) {
        return { output: "mkdir: missing operand" };
      }
      const dirName = args[0];
      if (dirName.includes("/")) {
        return { output: "mkdir: invalid directory name" };
      }
      // Call backend endpoint; if it fails, fallback to local
      try {
        const res = null; // skipping async call in this sync function
      } catch (e) {}

      const node = getNode(fileSystem, currentPath);
      if (!node || node.type !== "directory") {
        return { output: "Error: Current path is not a directory" };
      }

      if (node.children && node.children[dirName]) {
        return { output: `mkdir: ${dirName}: File exists` };
      }

      const newPath = currentPath === "/" ? `/${dirName}` : `${currentPath}/${dirName}`;
      const newFs = setNode(fileSystem, newPath, { type: "directory", children: {} });
      return { output: "", newFileSystem: newFs };
    }

    case "touch": {
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

      const newPath = currentPath === "/" ? `/${fileName}` : `${currentPath}/${fileName}`;
      const newFs = setNode(fileSystem, newPath, { type: "file" });
      return { output: "", newFileSystem: newFs };
    }

    default:
      return { output: `${cmd}: command not found` };
  }
}

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

function parsePath(currentPath, targetPath) {
  if (targetPath === "/") return "/";
  if (targetPath.startsWith("/")) return targetPath;
  if (targetPath === "..") {
    if (currentPath === "/") return "/";
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }
  if (currentPath === "/") return "/" + targetPath;
  return currentPath + "/" + targetPath;
}

function getNode(fs, path) {
  if (path === "/") return fs["/"];
  const parts = path.split("/").filter(Boolean);
  let current = fs["/"];
  for (const part of parts) {
    if (!current.children || !current.children[part]) return null;
    current = current.children[part];
  }
  return current;
}

function setNode(fs, path, node) {
  const newFs = JSON.parse(JSON.stringify(fs));
  if (path === "/") {
    newFs["/"] = node;
    return newFs;
  }
  const parts = path.split("/").filter(Boolean);
  let current = newFs["/"];
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children) current.children = {};
    if (!current.children[parts[i]]) {
      current.children[parts[i]] = { type: "directory", children: {} };
    }
    current = current.children[parts[i]];
  }
  if (!current.children) current.children = {};
  current.children[parts[parts.length - 1]] = node;
  return newFs;
}

// Remove an entry at path (file or directory). Returns new fs or throws if not found.
export function removePath(fs, path) {
  const newFs = JSON.parse(JSON.stringify(fs));
  if (path === "/") throw new Error('Cannot remove root');
  const parts = path.split('/').filter(Boolean);
  let current = newFs['/'];
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children || !current.children[parts[i]]) throw new Error('Path not found');
    current = current.children[parts[i]];
  }
  if (!current.children || !current.children[parts[parts.length - 1]]) throw new Error('Path not found');
  delete current.children[parts[parts.length - 1]];
  return newFs;
}

// Export helpers so the UI can manipulate the in-memory FS without backend
export { getNode, setNode };

// Async backend API helpers
export async function apiLs(path) {
  try {
    const res = await fetch(`/api/fs/ls?path=${encodeURIComponent(path)}`);
    if (!res.ok) return null;
    const data = await res.json();
    // controller returns { entries: [...] }
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

export async function apiTouch(path, name) {
  try {
    const res = await fetch('/api/fs/touch', {
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

export async function apiRm(path) {
  try {
    const res = await fetch('/api/fs/rm', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    if (!res.ok) return { ok: false, error: 'Network error' };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function apiPwd() {
  try {
    const res = await fetch('/api/fs/pwd');
    if (!res.ok) return { ok: false, error: 'Network error' };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function apiTree() {
  try {
    const res = await fetch('/api/fs/tree');
    if (!res.ok) return { ok: false, error: 'Network error' };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}



