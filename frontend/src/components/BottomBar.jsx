
export default function BottomBar({ currentTab, onChange }) {
  const tabs = [
    { key: "tasks", label: "Tasks" },
    { key: "notifications", label: "Notifications" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="fixed text-sm bottom-0 left-0 right-0 bg-white border-t flex flex-wrap justify-around py-2 gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 text-center py-2 ${
            currentTab === tab.key ? "text-blue-500 font-bold" : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
