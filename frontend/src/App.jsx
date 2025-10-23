import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Index from './pages/Index';
import Home from './pages/Home';
import ShellPage from './pages/Shell';
import About from './pages/About';
import FCFSVisualizer from './components/FCFSVisualizer';
import SJFVisualizer from './components/SJFVisualizer';
import PriorityVisualizer from './components/PriorityVisualizer';
import RRVisualizer from './components/RRVisualizer';
import './styles/app.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/visualizer" element={<Home />} />
            <Route path="/shell" element={<ShellPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/fcfs" element={<FCFSVisualizer />} />
            <Route path="/sjf" element={<SJFVisualizer />} />
            <Route path="/priority" element={<PriorityVisualizer />} />
            <Route path="/rr" element={<RRVisualizer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;