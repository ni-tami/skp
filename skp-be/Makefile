.PHONY: run
run:
	uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

.PHONY: initdb
initdb:
	PYTHONPATH=. uv run python -c "import asyncio; from app.db.connection import init_db; asyncio.run(init_db())"

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
	@echo "  run            - Start the FastAPI dev server with hot reload"
	@echo "  initdb         - Create all SQLAlchemy tables in the configured database"
	@echo "  test           - Run the pytest suite"
	@echo "  lint           - Run ruff linter"
	@echo "  format         - Run ruff formatter"
	@echo "  install        - Install project dependencies with uv"
	@echo "  dev            - Install dev dependencies and start the dev server"
	@echo "  clean          - Remove build artifacts, cache files, and temp files"
	@echo "  seed           - Seed the database with sample data"
	@echo "  deploy         - Deploy application (placeholder)"
