import React, { useState } from 'react';
import axios from 'axios';
import InputForm from '../common/InputForm';
import GanttChart from '../common/GanttChart';
import ResultTable from '../common/ResultTable';

const RRVisualizer = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantum, setQuantum] = useState(2);

  const handleSubmit = async (processes) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('https://scheduling-algorithms-zk3r.onrender.com/api/fcfs', {
  processes: processes
});
      
      setResult(response.data.result);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while calculating Round Robin');
      console.error('Round Robin Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Round Robin (RR)</h1>
        <p className="text-gray-600">
          Each process gets equal time slice (quantum) for execution. Fair scheduling with preemption.
        </p>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>Note:</strong> Time quantum determines how long each process runs before being preempted.
          </p>
        </div>
      </div>

      <InputForm 
        onSubmit={handleSubmit} 
        algorithm="Round Robin"
        quantum={quantum}
        setQuantum={setQuantum}
      />

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-gray-600">Calculating Round Robin schedule...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {result && (
        <>
          <GanttChart 
            processes={result.processes} 
            algorithm="Round Robin"
            quantum={result.quantum}
            timeline={result.timeline}
          />
          
          <ResultTable 
            processes={result.processes}
            avgWaiting={result.avgWaiting}
            avgTurnaround={result.avgTurnaround}
            algorithm="Round Robin"
          />
        </>
      )}
    </div>
  );
};

export default RRVisualizer;
