# backend/models.py
# -----------------------------
# Purpose: Define the Task table structure for the database

from sqlalchemy import Column, Integer, String
from database import Base

class Task(Base):
    __tablename__ = "tasks"  # Table name in the database

    id = Column(Integer, primary_key=True, index=True)  # Task ID
    description = Column(String, nullable=False)        # Task description
    status = Column(String, default="todo")            # Status: todo, in-progress, done

