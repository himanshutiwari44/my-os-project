const { spawn } = require('child_process');
const path = require('path');

/**
 * Executes a C++ program with given input and returns the output
 * @param {string} algorithm - The algorithm name (fcfs, sjf, priority, rr)
 * @param {string} input - Input string to pass to the C++ program
 * @returns {Promise<Object>} - Parsed JSON output from the C++ program
 */
function runCppProgram(algorithm, input) {
	return new Promise((resolve, reject) => {
		const isWindows = process.platform === 'win32';
		const executableName = isWindows ? `${algorithm}.exe` : algorithm;
		const executablePath = path.join(__dirname, '..', 'cpp', 'bin', executableName);

		const child = spawn(executablePath, [], { stdio: ['pipe', 'pipe', 'pipe'] });

		let stdoutData = '';
		let stderrData = '';

		child.stdout.on('data', (data) => {
			stdoutData += data.toString();
		});

		child.stderr.on('data', (data) => {
			stderrData += data.toString();
		});

		child.on('error', (err) => {
			reject(new Error(`Failed to start ${algorithm}: ${err.message}`));
		});

		child.on('close', (code) => {
			if (code !== 0) {
				return reject(new Error(`Process ${algorithm} exited with code ${code}. ${stderrData}`));
			}
			try {
				const trimmed = stdoutData.trim();
				const jsonStart = trimmed.indexOf('{');
				const jsonString = jsonStart >= 0 ? trimmed.slice(jsonStart) : trimmed;
				const result = JSON.parse(jsonString);
				resolve(result);
			} catch (parseError) {
				console.error(`Error parsing JSON from ${algorithm}:`, parseError);
				console.error('Raw output:', stdoutData);
				reject(new Error(`Failed to parse output from ${algorithm}`));
			}
		});

		// Write input and end stdin
		child.stdin.write(input);
		child.stdin.end();
	});
}

/**
 * Formats process data for C++ input
 * @param {Array} processes - Array of process objects
 * @param {number} quantum - Time quantum for Round Robin (optional)
 * @returns {string} - Formatted input string
 */
function formatInput(processes, quantum = null) {
	let input = `${processes.length}`;
	if (quantum !== null) {
		input += ` ${quantum}`; // RR expects n then quantum on same line
	}
	processes.forEach((process) => {
		input += `\n${process.id} ${process.arrival} ${process.burst} ${process.priority}`;
	});
	return input;
}

module.exports = {
	runCppProgram,
	formatInput,
};
