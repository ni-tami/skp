import asyncio
from datetime import datetime

from app.db.connection import AsyncSessionLocal, init_db
from app.models.location import Location
from app.models.user import UserAccount


async def seed() -> None:
    await init_db()
    async with AsyncSessionLocal() as session:
        user = UserAccount(username="demo_user", email="demo@example.com")
        session.add(user)
        await session.flush()

        session.add_all(
            [
                Location(
                    user_id=user.id,
                    latitude=37.7749,
                    longitude=-122.4194,
                    display_name="San Francisco",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                ),
                Location(
                    user_id=user.id,
                    latitude=40.7128,
                    longitude=-74.0060,
                    display_name="New York",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                ),
            ]
        )
        await session.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
