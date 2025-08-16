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


# for user info
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)  # WhatsApp number
