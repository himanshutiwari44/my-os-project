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
};
struct Segment {
    int pid; // -1 for idle
    int start;
    int end;
};

// Preemptive priority scheduling (lower priority number == higher priority)
void calculatePriority(vector<Process>& processes, vector<Segment>& timeline) {
    int n = processes.size();
    for (auto &p : processes) {
        p.start = -1;
        p.completion = -1;
        p.waiting = 0;
        p.turnaround = 0;
    }

    vector<int> remaining(n);
    for (int i = 0; i < n; ++i) remaining[i] = processes[i].burst;

    int completedCount = 0;
    int currentTime = 0;

    auto nextArrival = [&]() {
        int t = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (processes[i].completion == -1 && processes[i].arrival < t) t = processes[i].arrival;
        }
        return t;
    };

    while (completedCount < n) {
        // pick highest priority (lowest number) among arrived processes with remaining>0
        int chosen = -1;
        int bestPr = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (processes[i].arrival <= currentTime && remaining[i] > 0) {
                if (processes[i].priority < bestPr) {
                    bestPr = processes[i].priority;
                    chosen = i;
                } else if (processes[i].priority == bestPr) {
                    // tie-breaker: earlier arrival, then lower id
                    if (processes[i].arrival < processes[chosen].arrival) chosen = i;
                    else if (processes[i].arrival == processes[chosen].arrival && processes[i].id < processes[chosen].id) chosen = i;
                }
            }
        }

        if (chosen == -1) {
            int t = nextArrival();
            if (t == INT_MAX) break;
            if (!timeline.empty() && timeline.back().pid == -1) timeline.back().end = t;
            else timeline.push_back({-1, currentTime, t});
            currentTime = t;
            continue;
        }

        // start time
        if (processes[chosen].start == -1) processes[chosen].start = currentTime;

        // extend timeline or push
        if (!timeline.empty() && timeline.back().pid == processes[chosen].id) {
            timeline.back().end = currentTime + 1;
        } else {
            timeline.push_back({processes[chosen].id, currentTime, currentTime + 1});
        }

        // run one time unit
        remaining[chosen] -= 1;
        currentTime += 1;

        if (remaining[chosen] == 0) {
            processes[chosen].completion = currentTime;
            processes[chosen].turnaround = processes[chosen].completion - processes[chosen].arrival;
            processes[chosen].waiting = processes[chosen].turnaround - processes[chosen].burst;
            completedCount++;
        }
    }

    // ensure start values
    for (auto &p : processes) if (p.start == -1) p.start = p.arrival;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    vector<Process> processes(n);
    for (int i = 0; i < n; i++) {
        cin >> processes[i].id >> processes[i].arrival >> processes[i].burst >> processes[i].priority;
    }
    
    vector<Segment> timeline;
    calculatePriority(processes, timeline);

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

