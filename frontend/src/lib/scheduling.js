// Scheduling algorithms ported from TypeScript to JavaScript

export function calculateScheduling(processes, algorithm, quantum = 2) {
  switch (algorithm) {
    case "FCFS":
      return scheduleFCFS(processes);
    case "SJF":
      return scheduleSJF(processes);
    case "RR":
      return scheduleRR(processes, quantum);
    case "Priority":
      return schedulePriority(processes);
    default:
      return scheduleFCFS(processes);
  }
}

function scheduleFCFS(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart = [];
  const stats = [];
  let currentTime = 0;

  sorted.forEach((process) => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    const start = currentTime;
    const end = currentTime + process.burstTime;

    ganttChart.push({ processId: process.id, start, end });

    const completionTime = end;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    stats.push({
      processId: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    currentTime = end;
  });

  const avgWaitingTime = stats.reduce((sum, s) => sum + s.waitingTime, 0) / stats.length;
  const avgTurnaroundTime = stats.reduce((sum, s) => sum + s.turnaroundTime, 0) / stats.length;

  return { ganttChart, stats, avgWaitingTime, avgTurnaroundTime };
}

function scheduleSJF(processes) {
  const ganttChart = [];
  const stats = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
      continue;
    }

    const shortest = available.reduce((min, p) => (p.burstTime < min.burstTime ? p : min));

    const start = currentTime;
    const end = currentTime + shortest.burstTime;

    ganttChart.push({ processId: shortest.id, start, end });

    const completionTime = end;
    const turnaroundTime = completionTime - shortest.arrivalTime;
    const waitingTime = turnaroundTime - shortest.burstTime;

    stats.push({
      processId: shortest.id,
      arrivalTime: shortest.arrivalTime,
      burstTime: shortest.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    currentTime = end;
    remaining.splice(remaining.indexOf(shortest), 1);
  }

  const avgWaitingTime = stats.reduce((sum, s) => sum + s.waitingTime, 0) / stats.length;
  const avgTurnaroundTime = stats.reduce((sum, s) => sum + s.turnaroundTime, 0) / stats.length;

  return { ganttChart, stats, avgWaitingTime, avgTurnaroundTime };
}

function scheduleRR(processes, quantum) {
  const ganttChart = [];
  const stats = [];

  const queue = processes.map((p) => ({ process: p, remainingTime: p.burstTime }));
  queue.sort((a, b) => a.process.arrivalTime - b.process.arrivalTime);

  let currentTime = 0;
  const readyQueue = [];
  let idx = 0;

  while (queue.some((p) => p.remainingTime > 0) || readyQueue.length > 0) {
    while (idx < queue.length && queue[idx].process.arrivalTime <= currentTime) {
      if (queue[idx].remainingTime > 0 && !readyQueue.includes(queue[idx])) {
        readyQueue.push(queue[idx]);
      }
      idx++;
    }

    if (readyQueue.length === 0) {
      currentTime = queue[idx]?.process.arrivalTime ?? currentTime + 1;
      continue;
    }

    const current = readyQueue.shift();
    const executionTime = Math.min(quantum, current.remainingTime);
    const start = currentTime;
    const end = currentTime + executionTime;

    ganttChart.push({ processId: current.process.id, start, end });

    current.remainingTime -= executionTime;
    currentTime = end;

    while (idx < queue.length && queue[idx].process.arrivalTime <= currentTime) {
      if (queue[idx].remainingTime > 0 && !readyQueue.includes(queue[idx]) && queue[idx] !== current) {
        readyQueue.push(queue[idx]);
      }
      idx++;
    }

    if (current.remainingTime > 0) {
      readyQueue.push(current);
    } else {
      current.completionTime = currentTime;
    }
  }

  queue.forEach((state) => {
    const completionTime = state.completionTime;
    const turnaroundTime = completionTime - state.process.arrivalTime;
    const waitingTime = turnaroundTime - state.process.burstTime;

    stats.push({
      processId: state.process.id,
      arrivalTime: state.process.arrivalTime,
      burstTime: state.process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });
  });

  const avgWaitingTime = stats.reduce((sum, s) => sum + s.waitingTime, 0) / stats.length;
  const avgTurnaroundTime = stats.reduce((sum, s) => sum + s.turnaroundTime, 0) / stats.length;

  return { ganttChart, stats, avgWaitingTime, avgTurnaroundTime };
}

function schedulePriority(processes) {
  const ganttChart = [];
  const stats = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime));
      continue;
    }

    const highest = available.reduce((max, p) => ((p.priority || 0) < (max.priority || 0) ? p : max));

    const start = currentTime;
    const end = currentTime + highest.burstTime;

    ganttChart.push({ processId: highest.id, start, end });

    const completionTime = end;
    const turnaroundTime = completionTime - highest.arrivalTime;
    const waitingTime = turnaroundTime - highest.burstTime;

    stats.push({
      processId: highest.id,
      arrivalTime: highest.arrivalTime,
      burstTime: highest.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    currentTime = end;
    remaining.splice(remaining.indexOf(highest), 1);
  }

  const avgWaitingTime = stats.reduce((sum, s) => sum + s.waitingTime, 0) / stats.length;
  const avgTurnaroundTime = stats.reduce((sum, s) => sum + s.turnaroundTime, 0) / stats.length;

  return { ganttChart, stats, avgWaitingTime, avgTurnaroundTime };
}



