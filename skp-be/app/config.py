import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local.db")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me-please-32chars")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "43200"))

EXPO_ACCESS_TOKEN = os.getenv("EXPO_ACCESS_TOKEN", "")
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

CORS_ORIGINS = [
    o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()
]


from sqlalchemy.orm import declarative_base

Base = declarative_base()