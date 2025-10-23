const { runCppProgram, formatInput } = require('../utils/runCpp');

const calculateRoundRobin = async (req, res) => {
    try {
        const { processes, quantum } = req.body;
        
        if (!processes || !Array.isArray(processes) || processes.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid input: processes array is required and must not be empty' 
            });
        }
        
        if (quantum === undefined || quantum <= 0) {
            return res.status(400).json({ 
                error: 'Invalid input: quantum time is required and must be greater than 0' 
            });
        }
        
        // Validate and normalize process data (priority defaults to 1 for RR)
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
        
        const input = formatInput(normalized, quantum);
        const result = await runCppProgram('rr', input);
        
        res.json({
            algorithm: 'Round Robin',
            result: result
        });
        
    } catch (error) {
        console.error('Round Robin Controller Error:', error);
        res.status(500).json({ 
            error: 'Internal server error while calculating Round Robin',
            details: error.message 
        });
    }
};

module.exports = {
    calculateRoundRobin
};
