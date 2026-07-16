"""Alembic environment configuration.

Async-aware. The database URL is resolved the same way as
``app/db/connection.py`` (``DATABASE_URL`` env var, falling back to a local
SQLite file). For Postgres the async driver (``asyncpg``) is substituted.

Models are registered by importing ``app.models`` so that
``Base.metadata`` reflects every table for autogeneration.
"""

import asyncio
import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# Make the project root importable when alembic is invoked from a subdir.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.config import Base  # noqa: E402
import app.models  # noqa: E402,F401  (register models on metadata)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


DEFAULT_DATABASE_URL = "sqlite+aiosqlite:///./local.db"


def _resolve_db_url() -> str:
    """Return the async database URL (mirrors app/db/connection.py)."""
    raw = os.getenv("DATABASE_URL", "").strip()
    if not raw:
        return DEFAULT_DATABASE_URL

    # Allow a sync-style URL to be transparently upgraded to the async driver.
    if raw.startswith("postgresql://"):
        return raw.replace("postgresql://", "postgresql+asyncpg://", 1)
    if raw.startswith("sqlite:///"):
        return raw.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    return raw


config.set_main_option("sqlalchemy.url", _resolve_db_url())

target_metadata = Base.metadata


def _run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (emit SQL to stdout)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Batch mode allows ALTER on SQLite (which has limited ALTER support).
        render_as_batch=url.startswith("sqlite"),
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def _do_run_migrations(connection: Connection) -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        render_as_batch=url.startswith("sqlite"),
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def _run_async_migrations() -> None:
    """Run migrations in 'online' mode using an async engine."""
    url = config.get_main_option("sqlalchemy.url")
    kwargs = {"poolclass": pool.NullPool, "future": True}
    if url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}

    connectable = create_async_engine(url, **kwargs)

    async with connectable.connect() as connection:
        await connection.run_sync(_do_run_migrations)

    await connectable.dispose()


def _run_migrations_online() -> None:
    asyncio.run(_run_async_migrations())


if context.is_offline_mode():
    _run_migrations_offline()
else:
    _run_migrations_online()
