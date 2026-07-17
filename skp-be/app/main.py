from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, Base, engine
from app.routers import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables if not exist (works for sqlite dev; for Supabase prefer init_db.sql)
    
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="SKP API", version="0.2.0", lifespan=lifespan)

if CORS_ORIGINS == ["*"]:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(auth.router)


@app.get("/")
def root():
    return {"name": "SKP API", "ok": True}