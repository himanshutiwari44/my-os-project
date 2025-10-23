import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const algorithms = [
    {
      name: 'First Come First Serve (FCFS)',
      path: '/fcfs',
      description: 'Processes are executed in the order they arrive. ',
      color: 'blue'
    },
    {
      name: 'Shortest Job First (SJF)',
      path: '/sjf',
      description: 'Processes with shortest burst time are executed first.',
      color: 'green'
    },
    {
      name: 'Priority Scheduling',
      path: '/priority',
      description: 'Processes are executed based on their priority. Higher priority processes are executed first.',
      color: 'purple'
    },
    {
      name: 'Round Robin (RR)',
      path: '/rr',
      description: 'Each process gets equal time slice (quantum).',
      color: 'orange'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          CPU Scheduling Algorithm Visualizer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           CPU scheduling algorithms with Gantt charts 
          and detailed performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {algorithms.map((algorithm, index) => (
          <Link
            key={index}
            to={algorithm.path}
            className={`group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-${algorithm.color}-500`}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${algorithm.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                  <span className={`text-${algorithm.color}-600 font-bold text-lg`}>
                    {index + 1}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold text-${algorithm.color}-800`}>
                  {algorithm.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {algorithm.description}
              </p>
              <div className={`inline-flex items-center text-${algorithm.color}-600 font-medium group-hover:text-${algorithm.color}-700`}>
                Visualize Algorithm
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

  
          
         
    </div>
  );
};

export default Home;



