const { runCppProgram, formatInput } = require('../utils/runCpp');

const calculatePriority = async (req, res) => {
    try {
        const { processes } = req.body;
        
        if (!processes || !Array.isArray(processes) || processes.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid input: processes array is required and must not be empty' 
            });
        }
        
        // Validate process data
        for (let i = 0; i < processes.length; i++) {
            const process = processes[i];
            if (!process.id || process.arrival === undefined || process.burst === undefined || process.priority === undefined) {
                return res.status(400).json({ 
                    error: `Invalid process data at index ${i}: id, arrival, burst, and priority are required` 
                });
            }
        }
        
        const input = formatInput(processes);
        const result = await runCppProgram('priority', input);
        
        res.json({
            algorithm: 'Priority',
            result: result
        });
        
    } catch (error) {
        console.error('Priority Controller Error:', error);
        res.status(500).json({ 
            error: 'Internal server error while calculating Priority Scheduling',
            details: error.message 
        });
    }
};

module.exports = {
    calculatePriority
};

