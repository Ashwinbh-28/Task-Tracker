# backend/app.py
# -----------------------------
# Purpose: Start the Flask server and register API routes

from flask import Flask
from flask_cors import CORS
from database import Base, engine
from routes import tasks_bp


app = Flask(__name__)
CORS(app)  # Allow frontend (React) to call backend

@app.route("/")
def home():
    return "Task Tracker Backend is running!"
# Create tables in the database
Base.metadata.create_all(bind=engine)

# Register routes from routes.py
app.register_blueprint(tasks_bp)

# Run the server
if __name__ == "__main__":
    app.run(debug=True)  # localhost:5000
