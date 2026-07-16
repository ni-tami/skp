.PHONY: run
run:
	uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

.PHONY: initdb
initdb:
	@echo "initdb is deprecated; use 'make migrate' to apply Alembic migrations."
	PYTHONPATH=. uv run python -c "import asyncio; from app.db.connection import init_db; asyncio.run(init_db())"

# --- Alembic migrations (manual, async-aware) -------------------------------
# Apply all pending migrations to the configured DATABASE_URL.
.PHONY: migrate
migrate:
	uv run alembic upgrade head

.PHONY: migrate-current
migrate-current:
	uv run alembic current

# Generate a new autogenerate revision. Usage: make migrate-new MSG="add foo column"
.PHONY: migrate-new
migrate-new:
	uv run alembic revision --autogenerate -m "$(MSG)"

# Roll back the most recent migration.
.PHONY: migrate-rollback
migrate-rollback:
	uv run alembic downgrade -1

# Stamp an existing database as up-to-date at head without running DDL.
# Use this for databases that already match the current schema (e.g. existing
# local.db or Supabase instance) so that future migrations apply cleanly.
.PHONY: migrate-stamp
migrate-stamp:
	uv run alembic stamp head

# Show migration history.
.PHONY: migrate-history
migrate-history:
	uv run alembic history --verbose

.PHONY: test
test:
	uv run pytest

.PHONY: lint
lint:
	uv run ruff check app scripts tests 2>/dev/null || uv run ruff check app scripts

.PHONY: format
format:
	uv run ruff format app scripts tests 2>/dev/null || uv run ruff format app scripts

.PHONY: install
install:
	uv sync

.PHONY: dev
dev:
	uv sync --dev && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

.PHONY: clean
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .venv -prune -o -type f -name '*.pyc' -delete 2>/dev/null || true
	find . -type d -name '*.egg-info' -exec rm -rf {} + 2>/dev/null || true

.PHONY: seed
seed:
	PYTHONPATH=. uv run python scripts/seed.py

.PHONY: deploy
deploy:
	@echo "TODO: add deployment command (e.g., docker build, fly deploy, etc.)"
	@exit 1

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  run              - Start the FastAPI dev server with hot reload"
	@echo "  initdb           - (deprecated) create_all via SQLAlchemy; prefer 'make migrate'"
	@echo "  test             - Run the pytest suite"
	@echo "  lint             - Run ruff linter"
	@echo "  format           - Run ruff formatter"
	@echo "  install          - Install project dependencies with uv"
	@echo "  dev              - Install dev dependencies and start the dev server"
	@echo "  clean            - Remove build artifacts, cache files, and temp files"
	@echo "  seed             - Seed the database with sample data"
	@echo "  deploy           - Deploy application (placeholder)"
	@echo ""
	@echo "Migrations (Alembic, async-aware via migrations/env.py):"
	@echo "  migrate          - Apply all pending migrations (alembic upgrade head)"
	@echo "  migrate-current  - Show the current migration revision"
	@echo "  migrate-new      - Autogenerate a new revision (use MSG=\"...\")"
	@echo "  migrate-rollback - Roll back the most recent migration (alembic downgrade -1)"
	@echo "  migrate-stamp    - Stamp an existing DB as up-to-date at head (no DDL)"
	@echo "  migrate-history  - Show migration history"
