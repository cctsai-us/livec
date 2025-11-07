"""
Seed test data for development
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.config import settings

SQLALCHEMY_DATABASE_URL = f"mysql+aiomysql://{settings.mysql_user}:{settings.mysql_password}@{settings.mysql_host}:{settings.mysql_port}/{settings.mysql_database}"


async def seed_test_user():
    """Create a test user for development"""
    engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if test user already exists
        from sqlalchemy import select
        result = await session.execute(
            select(User).where(User.username == "test_user")
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            print(f"✅ Test user already exists: ID={existing_user.id}, username={existing_user.username}")
            return existing_user.id

        # Create test user
        test_user = User(
            username="test_user",
            email="test@example.com",
            phone_number="+1234567890",
            user_type="streamer",
            preferred_language="en",
            country="TW",
        )

        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)

        print(f"✅ Created test user: ID={test_user.id}, username={test_user.username}")
        return test_user.id


if __name__ == "__main__":
    print("🌱 Seeding test data...")
    user_id = asyncio.run(seed_test_user())
    print(f"\n✅ Test data seeded successfully!")
    print(f"📝 Test user ID: {user_id}")
    print(f"📝 Username: test_user")
    print(f"📝 Email: test@example.com")
