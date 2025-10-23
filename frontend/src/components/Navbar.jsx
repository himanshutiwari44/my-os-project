import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white w-full">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white/90 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <span className="font-bold text-xl drop-shadow text-white">CPU Scheduler + Mini Shell</span>
        </Link>
        <nav className="hidden  md:flex items-center gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:opacity-90 !text-white transition-opacity ${isActive ? "font-semibold underline" : "opacity-90"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/fcfs"
            className={({ isActive }) =>
              `hover:opacity-90 !text-white transition-opacity ${isActive ? "font-semibold underline" : "opacity-90"}`
            }
          >
            FCFS
          </NavLink>
          <NavLink
            to="/sjf"
            className={({ isActive }) =>
              `hover:opacity-90 !text-white transition-opacity ${isActive ? "font-semibold underline" : "opacity-90"}`
            }
          >
            SJF
          </NavLink>
          <NavLink
            to="/priority"
            className={({ isActive }) =>
              `hover:opacity-90 !text-white transition-opacity ${isActive ? "font-semibold underline" : "opacity-90"}`
            }
          >
            Priority
          </NavLink>
          <NavLink
            to="/rr"
            className={({ isActive }) =>
              `hover:opacity-90 !text-white transition-opacity ${isActive ? "font-semibold underline" : "opacity-90"}`
            }
          >
            Round Robin
          </NavLink>
          
        </nav>
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}


