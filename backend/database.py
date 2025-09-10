from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Replace 'palash' if your username is different.
# Replace 'your_actual_password' with the password you set for PostgreSQL.
SQLALCHEMY_DATABASE_URL = "postgresql://palash:palash123@localhost/gati_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

