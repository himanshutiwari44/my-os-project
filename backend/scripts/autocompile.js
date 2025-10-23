const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const cppDir = path.join(__dirname, '..', 'cpp');
const binDir = path.join(cppDir, 'bin');
const isWindows = process.platform === 'win32';

const sources = [
    { src: 'fcfs.cpp', out: isWindows ? 'fcfs.exe' : 'fcfs' },
    { src: 'sjf.cpp', out: isWindows ? 'sjf.exe' : 'sjf' },
    { src: 'priority.cpp', out: isWindows ? 'priority.exe' : 'priority' },
    { src: 'rr.cpp', out: isWindows ? 'rr.exe' : 'rr' }
];

function fileMtime(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return 0; // treat missing as very old
	}
}

function ensureBinDir() {
	if (!fs.existsSync(binDir)) {
		fs.mkdirSync(binDir, { recursive: true });
	}
}

function needsRecompile() {
	ensureBinDir();
	return sources.some(({ src, out }) => {
		const srcPath = path.join(cppDir, src);
		const outPath = path.join(binDir, out);
		const srcTime = fileMtime(srcPath);
		const outTime = fileMtime(outPath);
		return outTime === 0 || srcTime > outTime;
	});
}

function runCompile() {
	const script = isWindows ? 'compile.bat' : 'compile.sh';
	const scriptPath = path.join(cppDir, script);
	if (!fs.existsSync(scriptPath)) {
		console.error(`Compile script not found: ${scriptPath}`);
		process.exit(1);
	}
	console.log('[autocompile] Compiling C++ algorithms...');
	const result = spawnSync(isWindows ? scriptPath : 'bash', isWindows ? [] : [scriptPath], {
		cwd: cppDir,
		stdio: 'inherit',
		shell: isWindows, // allow .bat execution on Windows
	});
	if (result.status !== 0) {
		console.error('[autocompile] Compilation failed.');
		process.exit(result.status || 1);
	}
	console.log('[autocompile] Compilation finished.');
}

(function main() {
	try {
		if (needsRecompile()) {
			runCompile();
		} else {
			console.log('[autocompile] Binaries up to date.');
		}
	} catch (e) {
		console.error('[autocompile] Error:', e.message);
		process.exit(1);
	}
})();
