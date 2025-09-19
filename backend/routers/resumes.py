from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from db import get_session
from models import Resume, User
from schemas import ResumeCreate, ResumeOut
from auth_utils import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = session.get(User, int(payload.get("sub")))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=ResumeOut)
def create_resume(payload: ResumeCreate, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    r = Resume(user_id=user.id, title=payload.title, sections=json_dumps(payload.sections))
    session.add(r); session.commit(); session.refresh(r)
    return resume_to_out(r)

@router.get("/", response_model=list[ResumeOut])
def list_resumes(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    results = session.exec(select(Resume).where(Resume.user_id==user.id)).all()
    return [resume_to_out(r) for r in results]

@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume(resume_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    r = session.get(Resume, resume_id)
    if not r or r.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume_to_out(r)

@router.put("/{resume_id}", response_model=ResumeOut)
def update_resume(resume_id: int, payload: ResumeCreate, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    r = session.get(Resume, resume_id)
    if not r or r.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    r.title = payload.title
    r.sections = json_dumps(payload.sections)
    session.add(r); session.commit(); session.refresh(r)
    return resume_to_out(r)

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    r = session.get(Resume, resume_id)
    if not r or r.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    session.delete(r); session.commit()
    return {"detail": "Deleted"}

# helpers
import json
def json_dumps(obj):
    return json.dumps(obj, ensure_ascii=False)

def json_loads(s):
    try:
        return json.loads(s)
    except:
        return {}

def resume_to_out(r: Resume):
    return ResumeOut(id=r.id, user_id=r.user_id, title=r.title, sections=json_loads(r.sections))
