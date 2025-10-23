import { useEffect, useMemo, useRef, useState } from "react";
import { calculateScheduling } from "../lib/scheduling.js";
import GanttChart from "./GanttChart.jsx";

export default function CPUVisualizer() {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [processes, setProcesses] = useState([
    { id: "1", arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: "2", arrivalTime: 2, burstTime: 3, priority: 1 },
    { id: "3", arrivalTime: 4, burstTime: 1, priority: 3 },
  ]);
  const [showGantt, setShowGantt] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const intervalRef = useRef(null);

  const result = useMemo(() => {
    return calculateScheduling(processes, algorithm, Number(quantum) || 2);
  }, [processes, algorithm, quantum]);

  const minStart = useMemo(() => (result.ganttChart.length ? Math.min(...result.ganttChart.map((i) => i.start)) : 0), [result]);
  const maxEnd = useMemo(() => (result.ganttChart.length ? Math.max(...result.ganttChart.map((i) => i.end)) : 0), [result]);
  const totalDuration = Math.max(0, maxEnd - minStart);

  useEffect(() => {
    // Reset visualization when inputs change
    stopVisualization();
    setProgressTime(0);
  }, [algorithm, quantum, JSON.stringify(processes)]);

  useEffect(() => {
    if (!isVisualizing) return;
    if (totalDuration <= 0) return;
    intervalRef.current = setInterval(() => {
      setProgressTime((t) => {
        if (t >= totalDuration) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsVisualizing(false);
          return totalDuration;
        }
        return t + 1; // 1s increments
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisualizing, totalDuration]);

  function startVisualization() {
    if (totalDuration <= 0) return;
    setProgressTime(0);
    setIsVisualizing(true);
  }

  function stopVisualization() {
    setIsVisualizing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function updateProcess(index, field, value) {
    const updated = processes.map((p, i) => (i === index ? { ...p, [field]: Number(value) || 0 } : p));
    setProcesses(updated);
  }

  function addProcess() {
    const nextId = String(processes.length + 1);
    setProcesses([...processes, { id: nextId, arrivalTime: 0, burstTime: 1, priority: 1 }]);
  }

  function removeProcess(index) {
    setProcesses(processes.filter((_, i) => i !== index));
  }

  return (
    <section id="scheduler" className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-sky-700">CPU Scheduler</h2>
          <p className="text-sm text-sky-600">Visualize FCFS, SJF, RR and Priority</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border px-3 text-sm bg-white"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option>FCFS</option>
            <option>SJF</option>
            <option>RR</option>
            <option>Priority</option>
          </select>
          {algorithm === "RR" && (
            <input
              type="number"
              min={1}
              className="h-9 w-24 rounded-md border px-3 text-sm bg-white"
              value={quantum}
              onChange={(e) => setQuantum(e.target.value)}
              placeholder="Quantum"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-gradient-to-br from-white to-fuchsia-50">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-fuchsia-100 via-sky-100 to-emerald-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">PID</th>
              <th className="px-3 py-2 text-left">Arrival</th>
              <th className="px-3 py-2 text-left">Burst</th>
              {algorithm === "Priority" && (
                <th className="px-3 py-2 text-left">Priority</th>
              )}
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2 font-medium">P{p.id}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="h-8 w-24 rounded border px-2 bg-white"
                    value={p.arrivalTime}
                    onChange={(e) => updateProcess(idx, "arrivalTime", e.target.value)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="h-8 w-24 rounded border px-2 bg-white"
                    value={p.burstTime}
                    onChange={(e) => updateProcess(idx, "burstTime", e.target.value)}
                  />
                </td>
                {algorithm === "Priority" && (
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="h-8 w-24 rounded border px-2 bg-white"
                      value={p.priority ?? 1}
                      onChange={(e) => updateProcess(idx, "priority", e.target.value)}
                    />
                  </td>
                )}
                <td className="px-3 py-2 text-right">
                  <button className="rounded border px-2 py-1 text-xs hover:bg-rose-50" onClick={() => removeProcess(idx)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-3">
          <button className="rounded-md bg-sky-600 px-3 py-1.5 text-white text-sm hover:bg-sky-500" onClick={addProcess}>
            Add process
          </button>
          <div className="text-sm text-gray-700">
            <span className="mr-4">Avg WT: {result.avgWaitingTime.toFixed(2)}</span>
            <span>Avg TAT: {result.avgTurnaroundTime.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-500"
          onClick={() => setShowGantt((v) => !v)}
        >
          {showGantt ? "Hide Gantt Chart" : "View Gantt Chart"}
        </button>
        <button
          className="rounded-md bg-fuchsia-600 px-3 py-1.5 text-white text-sm hover:bg-fuchsia-500"
          onClick={() => (isVisualizing ? stopVisualization() : startVisualization())}
          disabled={totalDuration === 0}
        >
          {isVisualizing ? "Stop" : "Visualize"}
        </button>
      </div>

      {isVisualizing && (
        <div className="w-full rounded-lg border p-3 bg-gradient-to-r from-fuchsia-50 via-sky-50 to-emerald-50">
          <div className="mb-2 text-sm text-gray-700">Progress: {Math.min(progressTime, totalDuration)}s / {totalDuration}s</div>
          <div className="h-3 w-full rounded bg-gray-200">
            <div
              className="h-3 rounded bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 transition-[width]"
              style={{ width: `${totalDuration ? Math.min(100, (progressTime / totalDuration) * 100) : 0}%` }}
            />
          </div>
          <CurrentProcessBanner time={minStart + progressTime} items={result.ganttChart} />
        </div>
      )}

      {showGantt && <GanttChart items={result.ganttChart} />}
    </section>
  );
}

function CurrentProcessBanner({ time, items }) {
  if (!items || items.length === 0) return null;
  const active = items.find((i) => time >= i.start && time < i.end);
  if (!active) return (
    <div className="mt-2 text-sm text-gray-600">Idle...</div>
  );
  return (
    <div className="mt-2 text-sm font-medium text-sky-700">Running: P{active.processId} (t={time})</div>
  );
}


