from database import SessionLocal, engine
import crud, schemas, models

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

users_to_add = [
    schemas.UserCreate(police_id='OFFICER123', password='123456'),
    schemas.UserCreate(police_id='TRAFFIC001', password='654321'),
    schemas.UserCreate(police_id='PATROL202', password='202520')
]

for user_data in users_to_add:
    db_user = crud.get_user_by_police_id(db, police_id=user_data.police_id)
    if not db_user:
        crud.create_user(db=db, user=user_data)
        print(f"User {user_data.police_id} created.")
    else:
        print(f"User {user_data.police_id} already exists.")

db.close()
