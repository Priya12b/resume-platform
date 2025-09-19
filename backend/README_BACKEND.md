# Backend - Resume Platform (FastAPI)

## Setup (local)
1. Create virtualenv:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate    # Windows PowerShell
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and update SECRET_KEY if you want.
   Default DB uses SQLite `sqlite:///./app.db`. To use MongoDB Atlas you would change the DB layer (this project uses SQLite for simplicity and reliability).

4. Run the app:
   ```bash
   uvicorn main:app --reload
   ```

5. Seed demo user:
   ```bash
   python seed_demo_user.py
   ```

API endpoints:
- `POST /auth/signup` (body: email, password, full_name)
- `POST /auth/login` (form-data: username, password) -> returns access_token
- `GET /auth/me` (authorized)
- `POST /resumes` (authorized)
- `GET /resumes` (authorized)
- `GET /resumes/{id}` (authorized)
- `PUT /resumes/{id}` (authorized)
- `DELETE /resumes/{id}` (authorized)