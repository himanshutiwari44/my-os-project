// Navbar is provided by App.jsx; don't render it here to avoid duplicate headers
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-sky-50 to-emerald-50 text-gray-900">
      <main className="max-w-5xl mx-auto w-full px-6 py-16">
        <div className="text-center overflow-hidden">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600">
             CPU Scheduling and Shell Basics
          </h1>
          <p className="mt-3 text-gray-700">
            Explore process scheduling with Gantt charts or use an interactive mini shell.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link className="rounded-lg px-6 py-3 text-white bg-sky-400 hover:bg-sky-500" to="/visualizer">
              Open Visualizer
            </Link>
            <Link className="rounded-lg px-6 py-3 text-white bg-emerald-400 hover:bg-emerald-500" to="/shell">
              Open Shell
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


