import React from 'react';

const GanttChart = ({ processes, algorithm, quantum, timeline: providedTimeline }) => {
  const hasProvidedTimeline = Array.isArray(providedTimeline) && providedTimeline.length > 0;

  if ((!processes || processes.length === 0) && !hasProvidedTimeline) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Gantt Chart</h3>
        <p className="text-gray-600">No processes to display</p>
      </div>
    );
  }

  let timeline = [];
  let maxCompletion = 0;
  let minStart = 0;

  if (hasProvidedTimeline) {
    // Use backend-provided timeline
    timeline = providedTimeline.map(seg => ({
      type: seg.pid === -1 ? 'idle' : 'process',
      start: seg.start,
      duration: seg.end - seg.start,
      processId: seg.pid === -1 ? 'IDLE' : seg.pid,
    }));
    if (timeline.length > 0) {
      minStart = Math.min(...timeline.map(s => s.start));
      maxCompletion = Math.max(...timeline.map(s => s.start + s.duration));
    }
  } else {
    // Fallback: infer timeline from processes
    const sortedProcesses = [...processes].sort((a, b) => a.start - b.start);
    maxCompletion = Math.max(...processes.map(p => p.completion));
    minStart = Math.min(...processes.map(p => p.start));

    let currentTime = minStart;
    for (const process of sortedProcesses) {
      if (currentTime < process.start) {
        timeline.push({
          type: 'idle',
          start: currentTime,
          duration: process.start - currentTime,
          processId: 'IDLE'
        });
      }
      timeline.push({
        type: 'process',
        start: process.start,
        duration: process.completion - process.start,
        processId: process.id,
        process: process
      });
      currentTime = process.completion;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Gantt Chart - {algorithm}
        {quantum && <span className="text-sm text-gray-600 ml-2">(Quantum: {quantum})</span>}
      </h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Timeline */}
          <div className="flex items-center mb-4">
            <div className="w-20 text-sm font-medium text-gray-600">Time:</div>
            <div className="flex-1 flex">
              {timeline.map((segment, index) => (
                <div
                  key={index}
                  className={`flex-1 min-w-16 text-center text-xs py-2 border-l border-gray-300 ${
                    segment.type === 'idle' 
                      ? 'bg-gray-200 text-gray-600' 
                      : 'bg-blue-500 text-white'
                  }`}
                  style={{ flex: `${segment.duration} 0 0` }}
                >
                  {segment.start}
                </div>
              ))}
              <div className="text-xs text-gray-600 ml-2">
                {maxCompletion}
              </div>
            </div>
          </div>

          {/* Process bars */}
          <div className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-600">Process:</div>
            <div className="flex-1 flex">
              {timeline.map((segment, index) => (
                <div
                  key={index}
                  className={`flex-1 min-w-16 text-center text-xs py-3 border-l border-gray-300 ${
                    segment.type === 'idle' 
                      ? 'bg-gray-200 text-gray-600' 
                      : 'bg-blue-500 text-white'
                  }`}
                  style={{ flex: `${segment.duration} 0 0` }}
                >
                  {segment.type === 'idle' ? 'IDLE' : `P${segment.processId}`}
                </div>
              ))}
            </div>
          </div>

          {/* Duration labels */}
          <div className="flex items-center mt-2">
            <div className="w-20 text-sm font-medium text-gray-600">Duration:</div>
            <div className="flex-1 flex">
              {timeline.map((segment, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-16 text-center text-xs py-1 text-gray-600"
                  style={{ flex: `${segment.duration} 0 0` }}
                >
                  {segment.duration}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Process Execution</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-sm text-gray-600">CPU Idle</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
