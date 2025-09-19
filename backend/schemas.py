from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = ""

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = ""

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Education(BaseModel):
    degree: str
    institute: str
    year: str

class Experience(BaseModel):
    title: str
    company: str
    description: str

class ResumeCreate(BaseModel):
    title: Optional[str] = "Untitled Resume"
    sections: dict

class ResumeOut(BaseModel):
    id: int
    user_id: int
    title: str
    sections: dict