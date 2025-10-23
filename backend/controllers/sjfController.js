const { runCppProgram, formatInput } = require('../utils/runCpp');

const calculateSJF = async (req, res) => {
    try {
        const { processes } = req.body;
        
        if (!processes || !Array.isArray(processes) || processes.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid input: processes array is required and must not be empty' 
            });
        }
        
        // Validate and normalize process data (priority defaults to 1 for SJF)
        const normalized = processes.map((p, i) => {
            if (p.id === undefined || p.arrival === undefined || p.burst === undefined) {
                throw new Error(`Invalid process data at index ${i}: id, arrival, and burst are required`);
            }
            return {
                id: p.id,
                arrival: p.arrival,
                burst: p.burst,
                priority: p.priority === undefined || p.priority === null ? 1 : p.priority,
            };
        });
        
        const input = formatInput(normalized);
        const result = await runCppProgram('sjf', input);
        
        res.json({
            algorithm: 'SJF',
            result: result
        });
        
    } catch (error) {
        console.error('SJF Controller Error:', error);
        res.status(500).json({ 
            error: 'Internal server error while calculating SJF',
            details: error.message 
        });
    }
};

module.exports = {
    calculateSJF
};
