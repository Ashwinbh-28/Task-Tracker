import sys
import json
import os
from datetime import datetime

FILE_NAME = "task.json"

# Color codes
RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"


# Load tasks
def load_tasks():
    if not os.path.exists(FILE_NAME):
        with open(FILE_NAME, "w") as f:
            json.dump([], f)
    try:
        with open(FILE_NAME, "r") as f:
            data = f.read().strip()
            if not data:  # Empty file
                return []
            return json.loads(data)
    except (json.JSONDecodeError, ValueError):
        return []


# Save tasks
def save_tasks(tasks):
    with open(FILE_NAME, "w") as f:
        json.dump(tasks, f, indent=4)


# Current time
def get_current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# Add task
def add_task(description):
    tasks = load_tasks()
    new_id = max([task["id"] for task in tasks], default=0) + 1
    new_task = {
        "id": new_id,
        "description": description,
        "status": "todo",
        "created_at": get_current_time(),
        "updated_at": get_current_time(),
    }
    tasks.append(new_task)
    save_tasks(tasks)
    print(f"Task {new_id} added successfully.")


# Update task
def update_task(task_id, description):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["description"] = description
            task["updated_at"] = get_current_time()
            save_tasks(tasks)
            print(f"Task {task_id} updated successfully.")
            return
    print(f"Task {task_id} not found.")


# Delete task
def delete_task(task_id):
    tasks = load_tasks()
    new_tasks = [task for task in tasks if task["id"] != task_id]
    if len(tasks) == len(new_tasks):
        print(f"Task {task_id} not found.")
    else:
        save_tasks(new_tasks)
        print(f"Task {task_id} deleted successfully.")


# Color status text
def color_task(status):
    if status == "todo":
        return f"{RED}{status}{RESET}"
    elif status == "in-progress":
        return f"{YELLOW}{status}{RESET}"
    elif status == "done":
        return f"{GREEN}{status}{RESET}"
    return status


# Mark status
def mark_status(task_id, status):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["status"] = status
            task["updated_at"] = get_current_time()
            save_tasks(tasks)
            print(f"Task {task_id} marked as {status} successfully.")
            return
    print(f"Task {task_id} not found.")


# List tasks
def list_tasks(filter_status=None):
    tasks = load_tasks()
    if filter_status:
        tasks = [task for task in tasks if task["status"] == filter_status]
    if not tasks:
        print("No tasks found.")
        return
    for task in tasks:
        status_color = color_task(task["status"])
        print(
            f"ID: {task['id']}\n"
            f"Description: {task['description']}\n"
            f"Status: {status_color}\n"
            f"Created At: {task['created_at']}\n"
            f"Updated At: {task['updated_at']}\n"
        )


# Main CLI handler
def main():
    if len(sys.argv) < 2:
        print("Usage: Task Tracker <command> <arguments>")
        return

    command = sys.argv[1]

    if command == "add" and len(sys.argv) >= 3:
        add_task(" ".join(sys.argv[2:]))
    elif command == "update" and len(sys.argv) >= 4:
        update_task(int(sys.argv[2]), " ".join(sys.argv[3:]))
    elif command == "delete" and len(sys.argv) >= 3:
        delete_task(int(sys.argv[2]))
    elif command == "mark-in-progress" and len(sys.argv) == 3:
        mark_status(int(sys.argv[2]), "in-progress")
    elif command == "mark-done" and len(sys.argv) == 3:
        mark_status(int(sys.argv[2]), "done")
    elif command == "list":
        if len(sys.argv) == 2:
            list_tasks()
        else:
            list_tasks(sys.argv[2])
    else:
        print("Invalid command or arguments")


if __name__ == "__main__":
    main()
