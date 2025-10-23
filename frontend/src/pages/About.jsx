import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About CPU Scheduling Visualizer</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            This application provides an interactive visualization of various CPU scheduling algorithms 
            used in operating systems. It helps students and professionals understand how different 
            scheduling strategies affect process execution and system performance.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Supported Algorithms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">First Come First Serve (FCFS)</h3>
              <p className="text-gray-600">
                The simplest scheduling algorithm where processes are executed in the order they arrive. 
                While easy to implement, it may lead to poor average waiting times.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Shortest Job First (SJF)</h3>
              <p className="text-gray-600">
                Processes with the shortest burst time are executed first. This algorithm provides 
                optimal average waiting time but requires knowledge of burst times.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Priority Scheduling</h3>
              <p className="text-gray-600">
                Processes are executed based on their priority levels. Higher priority processes 
                are executed first, with lower numbers typically indicating higher priority.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Round Robin (RR)</h3>
              <p className="text-gray-600">
                Each process gets a fixed time slice (quantum) for execution. This provides fair 
                scheduling and prevents starvation of processes.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
            <li>Interactive Gantt chart visualization</li>
            <li>Real-time calculation using optimized C++ algorithms</li>
            <li>Detailed performance metrics (waiting time, turnaround time)</li>
            <li>Process input with customizable parameters</li>
            <li>Responsive design for all devices</li>
            <li>Educational tool for understanding scheduling concepts</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technical Implementation</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Architecture</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Frontend:</strong> React with modern UI components</li>
              <li><strong>Backend:</strong> Node.js with Express framework</li>
              <li><strong>Algorithms:</strong> C++ for optimal performance</li>
              <li><strong>Communication:</strong> RESTful API endpoints</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-8">
            <li>Select an algorithm from the home page</li>
            <li>Input process details (ID, arrival time, burst time, priority)</li>
            <li>For Round Robin, specify the time quantum</li>
            <li>Click "Calculate Schedule" to see the results</li>
            <li>Analyze the Gantt chart and performance metrics</li>
          </ol>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Educational Value</h3>
            <p className="text-blue-700">
              This tool is designed to help students and professionals understand the trade-offs 
              between different scheduling algorithms. By visualizing the execution timeline and 
              comparing performance metrics, users can better appreciate the impact of scheduling 
              decisions on system performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;



