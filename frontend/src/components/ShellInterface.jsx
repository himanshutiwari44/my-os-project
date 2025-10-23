import { useEffect, useRef, useState } from "react";
import { createInitialFileSystem, executeCommand, removePath } from "../lib/shell.js";

export default function ShellInterface() {
  const [history, setHistory] = useState(["Type 'help' to get started."]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/user");
  const [fs, setFs] = useState(() => createInitialFileSystem());
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const parts = cmd.split(/\s+/);
    const base = parts[0];

    if (base === 'mkdir') {
      if (parts.length < 2) {
        setHistory((h) => [...h, `$ ${cmd}`, 'mkdir: missing operand']);
      } else {
        const name = parts[1];
        const result = executeCommand(`mkdir ${name}`, cwd, fs);
        if (result.newFileSystem) {
          setFs(result.newFileSystem);
          setHistory((h) => [...h, `$ ${cmd}`, '']);
        } else {
          setHistory((h) => [...h, `$ ${cmd}`, result.output]);
        }
      }
    } else if (base === 'touch') {
      if (parts.length < 2) {
        setHistory((h) => [...h, `$ ${cmd}`, 'touch: missing file operand']);
      } else {
        const name = parts[1];
        const result = executeCommand(`touch ${name}`, cwd, fs);
        if (result.newFileSystem) {
          setFs(result.newFileSystem);
          setHistory((h) => [...h, `$ ${cmd}`, '']);
        } else {
          setHistory((h) => [...h, `$ ${cmd}`, result.output]);
        }
      }
    } else if (base === 'rm' || base === 'rmdir' || base === 'rm -r') {
      // assume 'rm <name>' with path relative to cwd
      if (parts.length < 2) {
        setHistory((h) => [...h, `$ ${cmd}`, 'rm: missing operand']);
      } else {
        const target = parts[1];
        const targetPath = target.startsWith('/') ? target : (cwd === '/' ? `/${target}` : `${cwd}/${target}`);
        try {
          const newFs = removePath(fs, targetPath);
          setFs(newFs);
          setHistory((h) => [...h, `$ ${cmd}`, '']);
        } catch (err) {
          setHistory((h) => [...h, `$ ${cmd}`, `rm: ${err.message}`]);
        }
      }
    } else if (base === 'ls') {
      const result = executeCommand(cmd, cwd, fs);
      setHistory((h) => [...h, `$ ${cmd}`, result.output]);
    } else if (base === 'pwd') {
      setHistory((h) => [...h, `$ ${cmd}`, cwd]);
    } else if (base === 'clear' || base === 'cls') {
      setHistory(['Type \'help\' to get started.']);
    } else {
      // fallback to local execution for other commands like cd, help
      const result = executeCommand(cmd, cwd, fs);
      setHistory((h) => [...h, `$ ${cmd}`, result.output]);
      if (result.newFileSystem) setFs(result.newFileSystem);
      if (result.newPath) setCwd(result.newPath);
    }

    setInput("");
  }

  return (
    <section id="shell" className="space-y-3 max-w-screen-lg mx-auto">
      <h2 className="text-xl font-semibold">Shell</h2>
      <div className="rounded-lg border bg-black text-green-200">
        <div className="h-72 md:h-96 lg:h-[34rem] overflow-auto p-4 space-y-2 font-mono text-sm md:text-base">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex items-center border-t border-gray-800 bg-gray-950 p-3">
          <span className="px-3 text-green-400 font-mono text-base md:text-lg">{cwd} $</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-green-200 outline-none font-mono text-base md:text-lg py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
          />
          <button className="ml-3 rounded bg-green-600 px-4 py-2 text-sm md:text-base text-white hover:bg-green-500">
            Run
          </button>
        </form>
      </div>
    </section>
  );
}



