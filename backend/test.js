const { runCppProgram, formatInput } = require('./utils/runCpp');

async function testAlgorithms() {
    console.log('Testing CPU Scheduling Algorithms...\n');
    
    const testProcesses = [
        { id: 1, arrival: 0, burst: 5, priority: 1 },
        { id: 2, arrival: 1, burst: 3, priority: 2 },
        { id: 3, arrival: 2, burst: 8, priority: 1 },
        { id: 4, arrival: 3, burst: 2, priority: 3 }
    ];
    
    const algorithms = ['fcfs', 'sjf', 'priority', 'rr'];
    
    for (const algorithm of algorithms) {
        try {
            console.log(`Testing ${algorithm.toUpperCase()}...`);
            
            let input;
            if (algorithm === 'rr') {
                input = formatInput(testProcesses, 2);
            } else {
                input = formatInput(testProcesses);
            }
            
            const result = await runCppProgram(algorithm, input);
            
            console.log(`✅ ${algorithm.toUpperCase()} - Success`);
            console.log(`   Average Waiting Time: ${result.avgWaiting.toFixed(2)}`);
            console.log(`   Average Turnaround Time: ${result.avgTurnaround.toFixed(2)}`);
            console.log(`   Processes: ${result.processes.length}\n`);
            
        } catch (error) {
            console.log(`❌ ${algorithm.toUpperCase()} - Failed: ${error.message}\n`);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testAlgorithms().catch(console.error);
}

module.exports = { testAlgorithms };



