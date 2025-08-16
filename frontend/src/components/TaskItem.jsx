import { useState } from "react";
import {
  Clock,
  Play,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Calendar,
  Tag,
  User,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react";
import { deleteTask, updateTask } from "../api/tasks";

const STATUS_CONFIG = {
  "todo": {
    label: "To Do",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    nextStatus: "in-progress",
    nextLabel: "Start Task"
  },
  "in-progress": {
    label: "In Progress",
    icon: Play,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    nextStatus: "done",
    nextLabel: "Complete"
  },
  "done": {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    nextStatus: null,
    nextLabel: null
  }
};

export default function TaskItem({ task, onUpdate, searchQuery = "" }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG["todo"];
  const StatusIcon = statusConfig.icon;

  const handleNext = async () => {
    if (!statusConfig.nextStatus || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, { status: statusConfig.nextStatus });
      onUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
      // Could add toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ?
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`
      group relative bg-white border-2 rounded-xl transition-all duration-200 hover:shadow-md
      ${statusConfig.borderColor} ${isDeleting ? 'opacity-50 scale-95' : ''}
      ${task.priority === 'high' ? 'ring-2 ring-red-200' : ''}
    `}>
      {/* Priority Indicator */}
      {task.priority === 'high' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}

      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Status Badge */}
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border
          `}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {statusConfig.nextStatus && (
              <button
                onClick={handleNext}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                title={statusConfig.nextLabel}
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-3 h-3" />
                )}
                {statusConfig.nextLabel}
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3 className={`text-lg font-semibold text-gray-800 mb-2 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
          {highlightText(task.title || task.description, searchQuery)}
        </h3>

        {/* Task Description */}
        {task.description && task.title && (
          <p className="text-gray-600 mb-3 leading-relaxed">
            {highlightText(task.description, searchQuery)}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4" />
              <span className={isOverdue ? 'font-semibold' : ''}>
                {formatDate(task.dueDate)}
              </span>
              {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center gap-1 text-gray-600">
              <User className="w-4 h-4" />
              <span>{task.assignee}</span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1 flex-wrap">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {highlightText(tag, searchQuery)}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Show Details Toggle */}
        {(task.notes || task.createdAt) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {task.notes && (
              <div>
                <span className="text-sm font-medium text-gray-700">Notes:</span>
                <p className="text-sm text-gray-600 mt-1">{task.notes}</p>
              </div>
            )}
            {task.createdAt && (
              <div className="text-xs text-gray-500">
                Created {new Date(task.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Delete Task</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
