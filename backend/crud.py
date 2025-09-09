from sqlalchemy.orm import Session
import models, schemas, auth

def get_user_by_police_id(db: Session, police_id: str):
    """
    Finds a user in the database by their unique police_id.
    """
    return db.query(models.User).filter(models.User.police_id == police_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """
    Creates a new user in the database.
    It takes the user's data, hashes the password, and saves it.
    """
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(police_id=user.police_id, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

