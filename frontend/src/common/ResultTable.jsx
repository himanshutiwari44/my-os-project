    import React from 'react';

const ResultTable = ({ processes, avgWaiting, avgTurnaround, algorithm }) => {
  if (!processes || processes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>
        <p className="text-gray-600">No results to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Results - {algorithm}
      </h3>
      
      {/* Process Details Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border border-gray-300 px-4 py-2 text-left">Process ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Arrival Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Burst Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Start Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Completion Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Waiting Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Turnaround Time</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id} className="hover:bg-gray-50 text-blue-500">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  P{process.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {process.arrival}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {process.burst}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {process.priority}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {process.start}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {process.completion}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    process.waiting > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {process.waiting}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {process.turnaround}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Average Waiting Time</h4>
          <div className="text-3xl font-bold text-blue-600">
            {avgWaiting.toFixed(2)}
          </div>
          <p className="text-sm text-blue-600 mt-1">time units</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Average Turnaround Time</h4>
          <div className="text-3xl font-bold text-green-600">
            {avgTurnaround.toFixed(2)}
          </div>
          <p className="text-sm text-green-600 mt-1">time units</p>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Performance Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total Processes:</span>
            <span className="ml-2 text-gray-600">{processes.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Execution Time:</span>
            <span className="ml-2 text-gray-600">
              {Math.max(...processes.map(p => p.completion)) - Math.min(...processes.map(p => p.start))}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">CPU Utilization:</span>
            <span className="ml-2 text-gray-600">
              {((processes.reduce((sum, p) => sum + p.burst, 0) / 
                (Math.max(...processes.map(p => p.completion)) - Math.min(...processes.map(p => p.start)))) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultTable;



