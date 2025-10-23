import React, { useState } from 'react';
import axios from 'axios';
import InputForm from '../common/InputForm';
import GanttChart from '../common/GanttChart';
import ResultTable from '../common/ResultTable';

const FCFSVisualizer = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (processes) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/fcfs', {
        processes: processes
      });
      
      setResult(response.data.result);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while calculating FCFS');
      console.error('FCFS Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">First Come First Serve (FCFS)</h1>
        <p className="text-gray-600">
          Processes are executed in the order they arrive. 
        </p>
      </div>

      <InputForm 
        onSubmit={handleSubmit} 
        algorithm="FCFS"
      />

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Calculating FCFS schedule...</span>
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
            algorithm="FCFS"
            timeline={result.timeline}
          />
          
          <ResultTable 
            processes={result.processes}
            avgWaiting={result.avgWaiting}
            avgTurnaround={result.avgTurnaround}
            algorithm="FCFS"
          />
        </>
      )}
    </div>
  );
};

export default FCFSVisualizer;
