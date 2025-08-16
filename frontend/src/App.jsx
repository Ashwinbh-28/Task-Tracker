import { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButtons";
import BottomBar from "./components/BottomBar";
import Profile from "./components/Profile";

export default function App() {
  const [filter, setFilter] = useState("");
  const [currentTab, setCurrentTab] = useState("tasks");
  const [showProfile, setShowProfile] = useState(false); // ✅ modal state

  return (
    <div className="max-w-xl mx-auto mt-10 mb-20 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Tracker</h1>

      {/* Always show tasks by default */}
      {currentTab === "tasks" && (
        <>
          <TaskForm onTaskAdded={() => setFilter("todo")} />
          <FilterButtons current={filter} onChange={setFilter} />
          <TaskList filter={filter} />
        </>
      )}

      {currentTab === "notifications" && (
        <div className="text-center text-gray-500 mt-10">
          No notifications yet 🚀
        </div>
      )}

      {/* Bottom bar with Profile click opening modal */}
      <BottomBar
        currentTab={currentTab}
        onChange={(tab) => {
          if (tab === "profile") {
            setShowProfile(true); // open modal
          } else {
            setCurrentTab(tab);
          }
        }}
      />

      {/* Profile modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-100 relative flex">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <Profile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
