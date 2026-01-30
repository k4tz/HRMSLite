# HRMS Lite

Fullstack application: **React (TypeScript)** frontend with **Vite** and **React Router**, **FastAPI** backend, and **MySQL** database.

## Project structure

```
HRMSLite/
 frontend/          # React + Vite + TypeScript + React Router
 backend/           # FastAPI + SQLAlchemy + MySQL
 README.md
```

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **MySQL** 8.x (running locally or remote)

## Quick start

### 1. MySQL

Create a database and user:

```sql
CREATE DATABASE hrmslite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hrmslite'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON hrmslite.* TO 'hrmslite'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials

python run.py
```

API runs at **http://127.0.0.1:8000**. Docs: **http://127.0.0.1:8000/api/docs**

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Optional: set VITE_API_BASE_URL if not using Vite proxy

npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` to the backend.

## Environment

| Location   | File         | Purpose                          |
|-----------|--------------|-----------------------------------|
| `backend/` | `.env`       | MySQL credentials, app settings  |
| `frontend/` | `.env`       | `VITE_API_BASE_URL` (optional)   |

## Scripts

**Frontend**

- `npm run dev` ? dev server (port 5173)
- `npm run build` ? production build
- `npm run preview` ? preview production build

**Backend**

- `python run.py` ? run FastAPI with uvicorn (port 8000)

## Tech stack

- **Frontend:** React 18, TypeScript, Vite 5, React Router 6
- **Backend:** FastAPI, Pydantic Settings, SQLAlchemy 2, PyMySQL
- **Database:** MySQL 8
