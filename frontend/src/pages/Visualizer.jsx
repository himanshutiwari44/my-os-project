import CPUVisualizer from "../components/CPUVisualizer.jsx";

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="max-w-6xl mx-auto w-full px-4 py-10 space-y-8">
        <CPUVisualizer />
      </main>
    </div>
  );
}


