from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.db.connection import init_db
from app.routers import auth
from app.routers import location
from app.routers import connect
from app.routers import routine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # create tables if not exist (works for sqlite dev; for Supabase prefer init_db.sql)
    await init_db()
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
app.include_router(location.router)
app.include_router(connect.router)
app.include_router(routine.router)

@app.get("/")
def root():
    return {"name": "SKP API", "ok": True}
