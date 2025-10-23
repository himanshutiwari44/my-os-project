# Installation Guide

## Quick Start

### 1. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install C++ JSON Library

#### Windows (using vcpkg)
```bash
vcpkg install jsoncpp
```

#### Ubuntu/Debian
```bash
sudo apt-get install libjsoncpp-dev
```

#### macOS (using Homebrew)
```bash
brew install jsoncpp
```

### 3. Compile C++ Algorithms

#### Windows
```bash
cd backend/cpp
compile.bat
```

#### Linux/macOS
```bash
cd backend/cpp
chmod +x compile.sh
./compile.sh
```

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 5. Access the Application

Open your browser and go to: `http://localhost:5173`

## Troubleshooting

### C++ Compilation Issues
- Ensure you have a C++ compiler installed (g++, clang++, or MSVC)
- Verify jsoncpp library is properly installed
- Check that the bin directory is created after compilation

### Backend Issues
- Ensure port 5000 is not in use
- Check that C++ executables are in the bin directory
- Verify Node.js version is 14 or higher

### Frontend Issues
- Ensure port 5173 is not in use
- Check that axios is installed
- Verify React version compatibility

## Testing

Run the test script to verify everything is working:

```bash
cd backend
node test.js
```

This will test all four scheduling algorithms with sample data.



