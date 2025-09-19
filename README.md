# Resume Platform - Full Stack Developer Assignment

A Minimal Viable Product (MVP) Resume Platform built for the Full Stack Developer Internship demo assignment.
Allows users to **signup/login**, **create/edit/view resumes**, and **download them as PDF**. Built with **React frontend** and **FastAPI backend**.

---

## 📂 Project Structure

```
resume-platform/
├─ backend/
│  ├─ main.py                 # FastAPI app entry
│  ├─ models.py               # Database models
│  ├─ routers/                # API routes (auth, resumes)
│  ├─ requirements.txt        # Backend dependencies
│  ├─ seed_demo_user.py       # Creates demo user
│  └─ .env.example            # Example environment variables
├─ frontend/
│  ├─ package.json            # Frontend dependencies
│  ├─ src/                    # React source code
│  ├─ public/                 # Public assets
│  └─ README_FRONTEND.md
├─ README.md                  # This file
└─ .gitignore                 # Ignores venv, node_modules, env
```
---

## ⚡ Features

* User **Authentication** (Signup/Login)
* **Dashboard**: View, Edit, Delete resumes
* **Create/Edit Resume** with form validations
* **View Resume** in multiple templates
* **Download Resume as PDF** via browser print (react-to-print)
* **Demo User** seeded for instant testing

---

## 🛠 Tech Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Frontend   | React, Material UI               |
| Backend    | FastAPI, Python                  |
| Database   | SQLite (local dev, configurable) |
| Auth       | JWT Tokens, bcrypt password hash |
| PDF Export | react-to-print (client-side)     |

---

## 🚀 Quick Start (Local)

### 1️⃣ Backend

```bash
cd backend
python -m venv venv
Activate venv:
Linux/Mac: source venv/bin/activate
Windows: venv\Scripts\activate
pip install -r requirements.txt

Setup environment variables
cp .env.example .env   # Edit if needed

Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Seed demo user
python seed_demo_user.py
```

---

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will run on [http://localhost:3000](http://localhost:3000) and connect to the backend at port `8000`.

---

## 👤 Demo Login (MANDATORY)

* **Email:** `hire-me@anshumat.org`
* **Password:** `HireMe@2025!`

> Use this to quickly test the full platform without creating a new account.

---

## 📝 Environment Variables

Create a `.env` file in the backend:

```
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your_jwt_secret_here
```

> You can change the database to PostgreSQL or MySQL by updating `DATABASE_URL`.

---

## ✅ Submission Checklist

* [x] Backend runs and demo user is seeded
* [x] Frontend can connect to backend and display resumes
* [x] Create/Edit/View/Download resume flows work
* [x] `node_modules/`, `venv/`, and `.env` are **not** pushed
* [x] `README.md` provides clear instructions to run project

---
## 💡 Notes for Reviewer 

* Clone repo and follow **Quick Start** section
* Demo user is pre-seeded; can create more resumes
* PDF export works directly in browser
* Clean folder structure for easy understanding
* You can add more resume templates in `frontend/src/components/templates/`

---