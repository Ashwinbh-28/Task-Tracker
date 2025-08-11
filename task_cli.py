import sys
import json
import os
from datetime import datetime

FILE_NAME = "task.json"
# Color for tasks
RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"

# load task
def load_tasks():
    if not os.path.exists(FILE_NAME):
        with open(FILE_NAME, "w") as f:
            json.dump([], f)
    with open(FILE_NAME, "r") as f:
        return json.load(f)

# save task
def save_tasks(tasks):
    with open(FILE_NAME, "w") as f:
        json.dump(tasks, f)

# get current task
def get_current_task():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# add task
def add_task(description):
    tasks = load_tasks()
    new_id = max([task["id"] for task in tasks], default=0) + 1
    new_task = {
        "id":new_id,
        "description": description,
        "status": "todo",
        "created_at": get_current_task(),
        "updatedAt": get_current_task()
    }
    tasks.append(new_task)
    save_tasks(tasks)
    print(f"Task {new_id} added successfully.")

# update task
def update_task(task_id, description):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["description"] = description
            task["updatedAt"] = get_current_task()
            save_tasks(tasks)
            print(f"Task {task_id} updated successfully.")
            return
    print(f"Task {task_id} not found.")

# Delete task
def delete_tasks(task_id):
    tasks = load_tasks()
    new_tasks = [task for task in tasks if task["id"] != task_id]
    if len(tasks) == len(new_tasks):
        print(f"Task {task_id} not found.")
    else:
        save_tasks(new_tasks)
        print(f"Task {task_id} deleted successfully.")

# color function
def color_task(status):
    if status == "todo":
        return f"{RED}{status}{RESET}"
    elif status == "in_progress":
        return f"{YELLOW}{status}{RESET}"
    elif status == "done":
        return f"{GREEN}{status}{RESET}"
    return status

# mark status of the task
def mark_status(task_id, status):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["status"] = status
            task["updatedAt"] = get_current_task()
            save_tasks(tasks)
            print(f"Task {task_id} marked as {status} successfully.")
            return
    print(f"Task {task_id} not found.")

# list the task
def list_tasks(filterStatus = None):
    tasks = load_tasks()
    if filterStatus:
        tasks = [task for task in tasks if task["status"] == filterStatus]
    if not tasks:
        print("No tasks found.")
        return
    for task in tasks:
        status_color = color_task(task["status"])
        print(f"ID: {task['id']}, Description: {task['description']}, Status: {task['status']}, Created At: {task['created_at']}, Updated At: {task['updated_at']}")


# main function
def main():
    if len(sys.argv) < 2:
        print("Usage: Task Tracker <command> <arguments>")
        return

    command = sys.argv[1]

    if command == "add" and len(sys.agrv) >= 3:
        add_task(''.join(sys.argv[2:]))
    elif command == "update" and len(sys.argv) >= 4:
        update_task(int(sys.argv[2]), ''.join(sys.argv[3:]))
    elif command == "delete" and len(sys.argv) >= 3:
        delete_tasks(int(sys.argv[2]))
    elif command == "mark" and len(sys.argv) >= 4:
        mark_status(int(sys.argv[2]), sys.argv[3])
    elif command == "list":
        if len(sys.argv) == 2:
            list_tasks()
        else:
            list_tasks(sys.argv[2])
    else:
        print("'Invalid Command or arguments")

if __name__ == "__main__":
    main()
