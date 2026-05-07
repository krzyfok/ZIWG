# Fullstack Setup: FastAPI + React (Vite)

Quick start guide for running the monorepo project locally.

---

##  1. Backend (FastAPI)

Open your **first terminal** and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment:
# On Windows:
.\.venv\Scripts\activate
# On Mac / Linux:
source .venv/bin/activate

# Install required dependencies
pip install fastapi uvicorn
pip install sqlalchemy

# Start the backend server
uvicorn main:app --reload
```
The API will be available at: http://127.0.0.1:8000
To test API: http://127.0.0.1:8000/docs

## 2. Frontend (React + Vite)
Open a second, separate terminal and run the following commands:

```Bash
# Navigate to the frontend directory
cd frontend

# Install node dependencies
npm install

# Start the development server
npm run dev
```
The app will be available at: http://localhost:5173
