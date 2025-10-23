#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <iomanip>
#include <climits>
#include <numeric>

using namespace std;

struct Process {
    int id;
    int arrival;
    int burst;
    int priority;
    int waiting;
    int turnaround;
    int completion;
    int start;
    int remaining;
};
struct Segment {
    int pid;
    int start;
    int end;
};

// Unit-step Round Robin implementation with timeline
void calculateRoundRobin(vector<Process>& processes, int quantum, vector<Segment>& timeline) {
    int n = processes.size();
    for (auto &p : processes) {
        p.start = -1;
        p.completion = -1;
        p.waiting = 0;
        p.turnaround = 0;
        p.remaining = p.burst;
    }
    // Build list of indices in arrival order
    vector<int> order(n);
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(), [&](int a, int b){
        if (processes[a].arrival != processes[b].arrival) return processes[a].arrival < processes[b].arrival;
        return processes[a].id < processes[b].id;
    });

    int currentTime = 0;
    int completedCount = 0;

    // If no process at t=0, jump to first arrival
    if (n > 0 && processes[order[0]].arrival > 0) currentTime = processes[order[0]].arrival;

    // Continue rounds until all completed
    while (completedCount < n) {
        bool anyRunThisRound = false;
        for (int idx : order) {
            if (processes[idx].remaining <= 0) continue; // already finished

            // Wait until process has arrived
            if (processes[idx].arrival > currentTime) {
                // if no one else is runnable right now, jump forward
                // but since we are iterating arrival order, if this process hasn't arrived yet, later ones won't either
                currentTime = processes[idx].arrival;
            }

            // Run this process for one quantum (or until completion)
            int runFor = min(quantum, processes[idx].remaining);
            if (processes[idx].start == -1) processes[idx].start = currentTime;

            if (!timeline.empty() && timeline.back().pid == processes[idx].id) timeline.back().end = currentTime + runFor;
            else timeline.push_back({processes[idx].id, currentTime, currentTime + runFor});

            processes[idx].remaining -= runFor;
            currentTime += runFor;
            anyRunThisRound = true;

            if (processes[idx].remaining == 0) {
                processes[idx].completion = currentTime;
                processes[idx].turnaround = processes[idx].completion - processes[idx].arrival;
                processes[idx].waiting = processes[idx].turnaround - processes[idx].burst;
                completedCount++;
            }
        }

        // If no process ran in this round (e.g., all remaining processes arrive in future), jump to next arrival
        if (!anyRunThisRound) {
            // find next earliest arrival among unfinished
            int nextT = INT_MAX;
            for (int i = 0; i < n; ++i) if (processes[i].remaining > 0) nextT = min(nextT, processes[i].arrival);
            if (nextT != INT_MAX) currentTime = max(currentTime, nextT);
        }
    }

    // ensure any not-started set
    for (auto &p : processes) if (p.start == -1) p.start = p.arrival;
}

int main() {
    int n, quantum;
    if (!(cin >> n >> quantum)) return 0;
    
    vector<Process> processes(n);
    for (int i = 0; i < n; i++) {
        cin >> processes[i].id >> processes[i].arrival >> processes[i].burst >> processes[i].priority;
        processes[i].start = -1; // Initialize start time
    }
    
    vector<Segment> timeline;
    calculateRoundRobin(processes, quantum, timeline);

    // Output JSON manually
    cout << "{\n";
    cout << "  \"processes\": [\n";
    for (int i = 0; i < (int)processes.size(); i++) {
        const auto& p = processes[i];
        cout << "    {\n";
        cout << "      \"id\": " << p.id << ",\n";
        cout << "      \"arrival\": " << p.arrival << ",\n";
        cout << "      \"burst\": " << p.burst << ",\n";
        cout << "      \"priority\": " << p.priority << ",\n";
        cout << "      \"start\": " << p.start << ",\n";
        cout << "      \"completion\": " << p.completion << ",\n";
        cout << "      \"waiting\": " << p.waiting << ",\n";
        cout << "      \"turnaround\": " << p.turnaround << "\n";
        cout << "    }";
        if (i < (int)processes.size() - 1) cout << ",";
        cout << "\n";
    }
    cout << "  ],\n";
    cout << "  \"quantum\": " << quantum << ",\n";

    // Emit timeline
    cout << "  \"timeline\": [\n";
    for (int i = 0; i < (int)timeline.size(); ++i) {
        const auto &s = timeline[i];
        cout << "    {\n";
        cout << "      \"pid\": " << s.pid << ",\n";
        cout << "      \"start\": " << s.start << ",\n";
        cout << "      \"end\": " << s.end << "\n";
        cout << "    }";
        if (i < (int)timeline.size() - 1) cout << ",";
        cout << "\n";
    }
    cout << "  ],\n";

    double avgWaiting = 0, avgTurnaround = 0;
    for (const auto& p : processes) {
        avgWaiting += p.waiting;
        avgTurnaround += p.turnaround;
    }
    avgWaiting /= n;
    avgTurnaround /= n;

    cout << "  \"avgWaiting\": " << fixed << setprecision(2) << avgWaiting << ",\n";
    cout << "  \"avgTurnaround\": " << fixed << setprecision(2) << avgTurnaround << "\n";
    cout << "}\n";
    
    return 0;
}

