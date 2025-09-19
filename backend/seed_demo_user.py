from sqlmodel import Session, select
from db import engine, get_session
from models import User, Resume
from auth_utils import get_password_hash

def seed():
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email=="hire-me@anshumat.org")).first()
        if existing:
            print("Demo user already exists")
            return
        user = User(email="hire-me@anshumat.org", full_name="Demo User", hashed_password=get_password_hash("HireMe@2025!"))
        session.add(user); session.commit(); session.refresh(user)
        print("Seeded demo user: hire-me@anshumat.org (password: HireMe@2025!)")
        # optional: add one sample resume
        sample_sections = {"personal": {"name": "Demo User", "email": "hire-me@anshumat.org"}, "education": [{"degree":"B.Tech","institute":"IIITV","year":"2024"}], "experience": [], "skills": ["Python","React"]}
        resume = Resume(user_id=user.id, title="Demo Resume", sections=__import__('json').dumps(sample_sections, ensure_ascii=False))
        session.add(resume); session.commit()
        print("Added sample resume (Demo Resume)")

if __name__ == '__main__':
    seed()