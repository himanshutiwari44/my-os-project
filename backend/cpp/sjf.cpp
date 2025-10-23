#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <iomanip>
#include <climits>
#include <limits.h>

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
    int pid; // process id (-1 for idle)
    int start;
    int end;
};

// Preemptive SJF (Shortest Remaining Time First)
void calculateSJF(vector<Process>& processes, vector<Segment>& timeline) {
    int n = processes.size();
    for (auto &p : processes) {
        p.remaining = p.burst;
        p.start = -1;
        p.completion = -1;
        p.waiting = 0;
        p.turnaround = 0;
    }

    int completedCount = 0;
    int currentTime = 0;

    auto nextArrivalTime = [&]() {
        int t = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (processes[i].completion == -1 && processes[i].arrival < t) t = processes[i].arrival;
        }
        return t;
    };

    while (completedCount < n) {
        // Find the process with smallest remaining time among arrived
        int idx = -1;
        int bestRem = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (processes[i].arrival <= currentTime && processes[i].remaining > 0) {
                if (processes[i].remaining < bestRem) {
                    bestRem = processes[i].remaining;
                    idx = i;
                }
            }
        }

        if (idx == -1) {
            // No arrived process ready -> jump to next arrival
            int t = nextArrivalTime();
            if (t == INT_MAX) break; // shouldn't happen
            // add idle segment if gap
            if (!timeline.empty() && timeline.back().pid == -1) {
                timeline.back().end = t;
            } else {
                timeline.push_back({-1, currentTime, t});
            }
            currentTime = t;
            continue;
        }

        // Run chosen process for 1 time unit (discrete simulation)
        if (processes[idx].start == -1) processes[idx].start = currentTime;

        // extend or push timeline segment
        if (!timeline.empty() && timeline.back().pid == processes[idx].id) {
            timeline.back().end = currentTime + 1;
        } else {
            timeline.push_back({processes[idx].id, currentTime, currentTime + 1});
        }

        processes[idx].remaining -= 1;
        currentTime += 1;

        if (processes[idx].remaining == 0) {
            processes[idx].completion = currentTime;
            processes[idx].turnaround = processes[idx].completion - processes[idx].arrival;
            processes[idx].waiting = processes[idx].turnaround - processes[idx].burst;
            completedCount++;
        }
    }
    
    // If any process never started, set start to arrival
    for (auto &p : processes) {
        if (p.start == -1) p.start = p.arrival;
    }
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    vector<Process> processes(n);
    for (int i = 0; i < n; i++) {
        cin >> processes[i].id >> processes[i].arrival >> processes[i].burst >> processes[i].priority;
    }
    
    vector<Segment> timeline;
    calculateSJF(processes, timeline);

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

