import { List, Clock, Play, CheckCircle } from "lucide-react";

const FILTERS = [
  {
    key: "",
    label: "All",
    icon: List,
    color: "blue",
    activeClass: "bg-blue-500 text-white border-blue-500",
    inactiveClass: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
  },
  {
    key: "todo",
    label: "To Do",
    icon: Clock,
    color: "orange",
    activeClass: "bg-orange-500 text-white border-orange-500",
    inactiveClass: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
  },
  {
    key: "in-progress",
    label: "In Progress",
    icon: Play,
    color: "indigo",
    activeClass: "bg-indigo-500 text-white border-indigo-500",
    inactiveClass: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
  },
  {
    key: "done",
    label: "Done",
    icon: CheckCircle,
    color: "green",
    activeClass: "bg-green-500 text-white border-green-500",
    inactiveClass: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
  },
];

export default function FilterButtons({ current, onChange, taskCounts = {} }) {
  return (
    <div className="w-full mb-6">
      {/* Desktop/Tablet Layout */}
      <div className="hidden sm:flex gap-3 justify-center flex-wrap">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = current === filter.key;
          const count = taskCounts[filter.key] || 0;

          return (
            <button
              key={filter.key || "all"}
              onClick={() => onChange(filter.key)}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${filter.color}-500 cursor-pointer
                ${isActive ? filter.activeClass : filter.inactiveClass}
              `}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>

              {/* Count Badge */}
              {count > 0 && (
                <span className={`
                  ml-1 px-2 py-0.5 text-xs font-bold rounded-full transition-colors
                  ${isActive
                    ? "bg-white/20 text-white"
                    : `bg-${filter.color}-100 text-${filter.color}-700`
                  }
                `}>
                  {count}
                </span>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Layout - Horizontal Scrollable */}
      <div className="sm:hidden overflow-x-auto">
        <div className="flex gap-2 px-4 py-2 min-w-max">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = current === filter.key;
            const count = taskCounts[filter.key] || 0;

            return (
              <button
                key={filter.key || "all"}
                onClick={() => onChange(filter.key)}
                className={`
                  relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-200 active:scale-95 min-w-[70px] cursor-pointer
                  ${isActive ? filter.activeClass : filter.inactiveClass}
                `}
                aria-pressed={isActive}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {count > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center
                      ${isActive
                        ? "bg-white/20 text-white"
                        : `bg-${filter.color}-500 text-white`
                      }
                    `}>
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </div>
                <span className="truncate w-full text-center ">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-2">
          <div className="flex gap-1">
            {FILTERS.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  current === FILTERS[index].key ? 'bg-gray-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
