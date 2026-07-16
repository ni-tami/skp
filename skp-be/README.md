# skp-be

FastAPI backend for SKP. Async SQLAlchemy + Alembic for migrations.

## Setup

```bash
uv sync
cp .env.example .env   # configure DATABASE_URL, JWT_SECRET, etc.
```

## Running

```bash
make run     # uvicorn with hot reload on 127.0.0.1:8000
make dev     # uv sync --dev then start the server
```

## Database migrations (Alembic)

Schema changes are managed by Alembic. The async engine is configured in
`migrations/env.py` and reads `DATABASE_URL` the same way as
`app/db/connection.py` (with fallback to `sqlite+aiosqlite:///./local.db`) and
auto-substitutes the async drivers (`+aiosqlite`, `+asyncpg`). Migrations are
**manual** (not run on app startup) so multi-worker deploys stay safe.

Apply pending migrations:

```bash
make migrate            # alembic upgrade head
make migrate-current    # show current revision
make migrate-history    # show migration history
```

Generate a new migration after editing models in `app/models/`:

```bash
make migrate-new MSG="add expo token expiry column"
```

Roll back the most recent migration:

```bash
make migrate-rollback    # alembic downgrade -1
```

### Pointing an existing DB at Alembic

If you have a database that already matches the current schema (e.g. an
existing `local.db` created by the old `make initdb`, or a Supabase instance
seeded from `init_db.sql`), stamp it as up-to-date at `head` so future
migrations apply cleanly — **no DDL is executed**:

```bash
DATABASE_URL="sqlite+aiosqlite:///./local.db" make migrate-stamp
```

For a brand-new/empty database, just run `make migrate` instead; it will create
all tables from the baseline revision forward.

## Other

```bash
make test      # pytest
make lint      # ruff check
make format    # ruff format
make seed      # seed sample data
make clean     # remove caches / build artifacts
```