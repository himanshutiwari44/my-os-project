#!/bin/bash

# Compilation script for CPU Scheduling Algorithms
echo "Compiling CPU Scheduling Algorithms..."

# Create bin directory if it doesn't exist
mkdir -p bin

# Compile FCFS
echo "Compiling FCFS..."
g++ -o bin/fcfs fcfs.cpp

# Compile SJF
echo "Compiling SJF..."
g++ -o bin/sjf sjf.cpp

# Compile Priority
echo "Compiling Priority..."
g++ -o bin/priority priority.cpp

# Compile Round Robin
echo "Compiling Round Robin..."
g++ -o bin/rr rr.cpp

echo "Compilation complete!"
echo "Executables are in the bin/ directory"
