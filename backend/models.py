from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "police_officers"

    id = Column(Integer, primary_key=True, index=True)
    police_id = Column(String, unique=True, index=True)
    hashed_password = Column(String)
