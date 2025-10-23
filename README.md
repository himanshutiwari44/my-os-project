# CPU Scheduling Algorithm Visualizer

A comprehensive web-based application for visualizing and comparing different CPU scheduling algorithms used in operating systems.

## 🚀 Features

- **Interactive Visualization**: Dynamic Gantt charts showing process execution timeline
- **Multiple Algorithms**: Support for FCFS, SJF, Priority, and Round Robin scheduling
- **Real-time Calculation**: Fast C++ backend for accurate algorithm execution
- **Performance Metrics**: Detailed analysis of waiting time, turnaround time, and CPU utilization
- **Modern UI**: Responsive design with intuitive user interface
- **Educational Tool**: Perfect for students learning operating system concepts

## 🏗️ Architecture

### Frontend
- **React** with modern hooks and functional components
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express framework
- **C++** algorithms for optimal performance
- **RESTful API** endpoints for each scheduling algorithm

## 📁 Project Structure

```
cpu-scheduler-visualizer/
├── backend/
│   ├── server.js                    # Express server
│   ├── routes/
│   │   └── scheduleRoutes.js        # API routes
│   ├── controllers/
│   │   ├── fcfsController.js        # FCFS controller
│   │   ├── sjfController.js         # SJF controller
│   │   ├── priorityController.js    # Priority controller
│   │   └── rrController.js          # Round Robin controller
│   ├── cpp/
│   │   ├── fcfs.cpp                 # FCFS algorithm
│   │   ├── sjf.cpp                  # SJF algorithm
│   │   ├── priority.cpp             # Priority algorithm
│   │   ├── rr.cpp                   # Round Robin algorithm
│   │   ├── compile.sh               # Compilation script
│   │   └── bin/                     # Compiled executables
│   ├── utils/
│   │   └── runCpp.js                # C++ execution utility
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FCFSVisualizer.jsx   # FCFS visualization
│   │   │   ├── SJFVisualizer.jsx    # SJF visualization
│   │   │   ├── PriorityVisualizer.jsx # Priority visualization
│   │   │   ├── RRVisualizer.jsx     # Round Robin visualization
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── common/
│   │   │   ├── InputForm.jsx        # Process input form
│   │   │   ├── GanttChart.jsx       # Gantt chart component
│   │   │   └── ResultTable.jsx      # Results table component
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Home page
│   │   │   └── About.jsx            # About page
│   │   ├── styles/
│   │   │   └── app.css              # Custom styles
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- C++ compiler (g++ or clang++)
- JSON library for C++ (jsoncpp)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Install C++ JSON library:
```bash
# Ubuntu/Debian
sudo apt-get install libjsoncpp-dev

# macOS with Homebrew
brew install jsoncpp

# Windows (using vcpkg)
vcpkg install jsoncpp
```

4. Compile C++ algorithms:
```bash
cd cpp
chmod +x compile.sh
./compile.sh
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Select Algorithm**: Choose from FCFS, SJF, Priority, or Round Robin
2. **Input Processes**: Enter process details (ID, arrival time, burst time, priority)
3. **Set Parameters**: For Round Robin, specify the time quantum
4. **Calculate**: Click "Calculate Schedule" to see results
5. **Analyze**: View the Gantt chart and performance metrics

## 📊 Supported Algorithms

### First Come First Serve (FCFS)
- Processes executed in arrival order
- Simple but may have poor average waiting time
- Non-preemptive

### Shortest Job First (SJF)
- Processes with shortest burst time executed first
- Optimal for minimizing average waiting time
- Non-preemptive

### Priority Scheduling
- Processes executed based on priority levels
- Lower numbers indicate higher priority
- Non-preemptive

### Round Robin (RR)
- Each process gets equal time slice
- Fair scheduling with preemption
- Prevents starvation

## 🔧 API Endpoints

- `POST /api/fcfs` - Calculate FCFS schedule
- `POST /api/sjf` - Calculate SJF schedule
- `POST /api/priority` - Calculate Priority schedule
- `POST /api/rr` - Calculate Round Robin schedule
- `GET /health` - Health check endpoint

## 📈 Performance Metrics

- **Waiting Time**: Time a process waits in ready queue
- **Turnaround Time**: Total time from arrival to completion
- **Average Waiting Time**: Mean waiting time across all processes
- **Average Turnaround Time**: Mean turnaround time across all processes
- **CPU Utilization**: Percentage of time CPU is busy

## 🎨 Customization

The application is designed to be easily customizable:

- Modify C++ algorithms in `backend/cpp/`
- Update UI components in `frontend/src/components/`
- Customize styles in `frontend/src/styles/app.css`
- Add new algorithms by following the existing pattern

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Operating Systems concepts and algorithms
- React and Node.js communities
- Educational resources for CPU scheduling

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy Learning! 🎓**



