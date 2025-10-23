import { useMemo, useRef } from "react";

const COLORS = [
  "bg-fuchsia-600",
  "bg-sky-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
];

export default function GanttChart({ items }) {
  const scrollRef = useRef(null);

  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-500">No schedule yet</div>;
  }

  const { minStart, total, widthPx } = useMemo(() => {
    const minS = Math.min(...items.map((i) => i.start));
    const maxE = Math.max(...items.map((i) => i.end));
    const tot = Math.max(1, maxE - minS);
    // Width in pixels for the full chart timeline (desktop-first)
    const px = Math.max(960, tot * 80);
    return { minStart: minS, total: tot, widthPx: px };
  }, [items]);

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-lg border bg-gradient-to-br from-white to-sky-50" ref={scrollRef}>
        <div className="relative h-24" style={{ width: `${widthPx}px` }}>
          {items.map((item, idx) => {
            const left = ((item.start - minStart) / total) * widthPx;
            const width = ((item.end - item.start) / total) * widthPx;
            return (
              <div
                key={idx}
                className={`absolute top-4 h-8 rounded text-xs flex items-center justify-center text-white shadow ${COLORS[idx % COLORS.length]}`}
                style={{ left: `${left}px`, width: `${width}px` }}
                title={`P${item.processId}: ${item.start}-${item.end}`}
              >
                P{item.processId}
              </div>
            );
          })}
          <div className="absolute bottom-0 left-0 right-0 text-[10px] text-gray-500">
            <div className="relative h-6" style={{ width: `${widthPx}px` }}>
              {Array.from({ length: total + 1 }).map((_, i) => (
                <div key={i} className="absolute -translate-x-1/2" style={{ left: `${(i / total) * widthPx}px` }}>
                  {minStart + i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
          onClick={() => scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
        >
          ◀ Scroll Left
        </button>
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
          onClick={() => scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
        >
          Scroll Right ▶
        </button>
      </div>
    </div>
  );
}


