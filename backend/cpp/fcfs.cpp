#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <iomanip>

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

void calculateFCFS(vector<Process>& processes) {
    // Sort by arrival time
    sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrival < b.arrival;
    });
    
    int currentTime = 0;
    for (auto& p : processes) {
        if (currentTime < p.arrival) {
            currentTime = p.arrival;
        }
        p.start = currentTime;
        p.completion = currentTime + p.burst;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;
        currentTime = p.completion;
    }
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    vector<Process> processes(n);
    for (int i = 0; i < n; i++) {
        cin >> processes[i].id >> processes[i].arrival >> processes[i].burst >> processes[i].priority;
    }
    
    calculateFCFS(processes);
    
    // Output as manual JSON
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



