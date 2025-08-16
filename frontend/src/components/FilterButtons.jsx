export default function FilterButtons({ current, onChange }) {
  const filters = ["", "todo", "in-progress", "done"]; // ✅ include "all"

  return (
    <div className="flex gap-4 mb-4 justify-center flex-wrap">
      {filters.map((f) => (
        <button
          key={f || "all"}
          onClick={() => onChange(f)}
          className={`px-4 py-2 rounded cursor-pointer ${
            current === f ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {f === "" ? "ALL" : f.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
