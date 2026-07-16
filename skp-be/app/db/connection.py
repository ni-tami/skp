import os

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import Base

DEFAULT_DATABASE_URL = "sqlite+aiosqlite:///./local.db"

_raw_url = os.getenv("DATABASE_URL", "")
DATABASE_URL = _raw_url if _raw_url.strip() else DEFAULT_DATABASE_URL

if DATABASE_URL.startswith("sqlite"):
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
        if "aiosqlite" in DATABASE_URL
        else {},
    )
elif DATABASE_URL.startswith("postgresql"):
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
    )
else:
    raise ValueError(f"Unsupported database URL scheme: {DATABASE_URL}")

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    await engine.dispose()
