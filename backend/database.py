
# backend/database.py
# -----------------------------
# Purpose: Set up connection to the database using SQLAlchemy
# Usage: Import this in models.py and routes.py to access DB

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATABASE_URL specifies SQLite database file
DATABASE_URL = "sqlite:///tasks.db"  # For production, you can switch to PostgreSQL/MySQL

# Create the engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a SessionLocal class for interacting with DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for creating models
Base = declarative_base()
