import { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, AlertCircle, CheckCircle2, Clock, Play, List } from "lucide-react";
import { getTasks } from "../api/tasks";
import TaskItem from "./TaskItem";

const FILTER_LABELS = {
  "": "All Tasks",
  "todo": "To Do Tasks",
  "in-progress": "In Progress Tasks",
  "done": "Completed Tasks"
};

const FILTER_ICONS = {
  "": List,
  "todo": Clock,
  "in-progress": Play,
  "done": CheckCircle2
};

const EMPTY_STATE_MESSAGES = {
  "": {
    icon: List,
    title: "No tasks yet",
    subtitle: "Create your first task to get started",
    color: "text-gray-400"
  },
  "todo": {
    icon: Clock,
    title: "No pending tasks",
    subtitle: "All caught up! Great work.",
    color: "text-orange-400"
  },
  "in-progress": {
    icon: Play,
    title: "No active tasks",
    subtitle: "Start working on a task to see it here",
    color: "text-indigo-400"
  },
  "done": {
    icon: CheckCircle2,
    title: "No completed tasks",
    subtitle: "Complete some tasks to see your achievements",
    color: "text-green-400"
  }
};

export default function TaskList({ filter, searchQuery = "" }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch tasks from backend with error handling
  const fetchTasks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await getTasks();
      let data = res.data || [];

      // Apply status filter
      if (filter && filter !== "") {
        data = data.filter((t) => t.status === filter);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        data = data.filter((task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchTasks(true);
  };

  // Get current filter info
  const FilterIcon = FILTER_ICONS[filter] || List;
  const filterLabel = FILTER_LABELS[filter] || "Tasks";
  const emptyState = EMPTY_STATE_MESSAGES[filter] || EMPTY_STATE_MESSAGES[""];
  const EmptyIcon = emptyState.icon;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-700">{filterLabel}</h2>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">{filterLabel}</h2>
          {tasks.length > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
              {tasks.length}
            </span>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh tasks"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            {tasks.length > 0
              ? `Found ${tasks.length} task${tasks.length === 1 ? '' : 's'} matching "${searchQuery}"`
              : `No tasks found matching "${searchQuery}"`
            }
          </span>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <EmptyIcon className={`w-20 h-20 mx-auto mb-4 ${emptyState.color}`} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{emptyState.title}</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{emptyState.subtitle}</p>

          {searchQuery ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Tasks
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="transform transition-all duration-200 hover:scale-[1.01]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskItem
                task={task}
                onUpdate={fetchTasks}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 sm:h-4"></div>
    </div>
  );
}
