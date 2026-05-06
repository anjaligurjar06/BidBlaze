from database import engine
from models import Base

# Drop all tables
Base.metadata.drop_all(bind=engine)

# Recreate all tables fresh
Base.metadata.create_all(bind=engine)

print("Database reset complete! Fresh start 🚀")