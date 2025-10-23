import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-gray-600">Page not found</p>
        <Link
          to="/"
          className="inline-block mt-6 rounded-md bg-black text-white px-4 py-2 hover:bg-gray-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}



