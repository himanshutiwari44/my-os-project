import React, { useState } from 'react';

const InputForm = ({ onSubmit, algorithm, quantum, setQuantum }) => {
  const [processes, setProcesses] = useState([
    { id: 1, arrival: 0, burst: 5, priority: 1 }
  ]);

  const addProcess = () => {
    const newId = Math.max(...processes.map(p => p.id)) + 1;
    setProcesses([...processes, { id: newId, arrival: 0, burst: 1, priority: 1 }]);
  };

  const removeProcess = (index) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((_, i) => i !== index));
    }
  };

  const updateProcess = (index, field, value) => {
    const updated = processes.map((p, i) => 
      i === index ? { ...p, [field]: parseInt(value) || 0 } : p
    );
    setProcesses(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(processes);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Process Input - {algorithm}
      </h2>
      
      {algorithm === 'Round Robin' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Quantum
          </label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border text-blue-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter time quantum"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Processes</h3>
            <button
              type="button"
              onClick={addProcess}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Add Process
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border border-gray-300 px-4 py-2 text-left">Process ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Arrival Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Burst Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, index) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={process.id}
                        onChange={(e) => updateProcess(index, 'id', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={process.arrival}
                        onChange={(e) => updateProcess(index, 'arrival', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={process.burst}
                        onChange={(e) => updateProcess(index, 'burst', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={process.priority}
                        onChange={(e) => updateProcess(index, 'priority', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeProcess(index)}
                        disabled={processes.length === 1}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Calculate {algorithm} Schedule
        </button>
      </form>
    </div>
  );
};

export default InputForm;



