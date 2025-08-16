import { CheckSquare, Bell, User, Home, Settings } from "lucide-react";

const TABS = [
  {
    key: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    activeColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    activeColor: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    key: "profile",
    label: "Profile",
    icon: User,
    activeColor: "text-green-600",
    bgColor: "bg-green-50"
  },
];

export default function BottomBar({ currentTab, onChange, notificationCount = 0 }) {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <div className="h-20"></div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center px-2 py-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.key;
            const hasNotification = tab.key === "notifications" && notificationCount > 0;

            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`
                  relative flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 rounded-xl transition-all duration-200 transform active:scale-95
                  ${isActive
                    ? `${tab.activeColor} ${tab.bgColor} font-semibold`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
                aria-label={tab.label}
                role="tab"
                aria-selected={isActive}
              >
                {/* Icon Container */}
                <div className="relative mb-1">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />

                  {/* Notification Badge */}
                  {hasNotification && (
                    <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </div>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${tab.activeColor.replace('text-', 'bg-')}`}></div>
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs leading-tight truncate max-w-full ${
                  isActive ? "font-semibold" : "font-medium"
                }`}>
                  {tab.label}
                </span>

                {/* Active Background Glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Safe Area for iOS */}
        <div className="h-safe-area-inset-bottom bg-white"></div>
      </div>
    </>
  );
}
