from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Detect if running on Render.com
if os.getenv("RENDER"):
    # Render container path
    SQLALCHEMY_DATABASE_URL = "sqlite:////opt/render/project/src/geometry.db"
else:
    # Local development path
    SQLALCHEMY_DATABASE_URL = "sqlite:///./geometry.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
