# backend/routes.py
# -----------------------------
# Purpose: Define all API endpoints to manage tasks

from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Task

# Blueprint allows us to separate routes from main app
tasks_bp = Blueprint("tasks", __name__)

# -----------------------------
# Get all tasks
@tasks_bp.route("/tasks", methods=["GET"])
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()  # Get all tasks
    result = [{"id": t.id, "description": t.description, "status": t.status} for t in tasks]
    return jsonify(result)

# -----------------------------
# Add a new task
@tasks_bp.route("/tasks", methods=["POST"])
def add_task():
    db = SessionLocal()
    data = request.json  # Frontend sends {"description": "Buy groceries"}
    new_task = Task(description=data["description"])
    db.add(new_task)
    db.commit()
    return jsonify({"message": "Task added", "task_id": new_task.id}), 201

# -----------------------------
# Update a task (description or status)
@tasks_bp.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    db = SessionLocal()
    data = request.json
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    db.commit()
    return jsonify({"message": "Task updated"})

# -----------------------------
# Delete a task
@tasks_bp.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    db.delete(task)
    db.commit()
    return jsonify({"message": "Task deleted"})

