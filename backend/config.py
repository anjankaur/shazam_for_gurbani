"""
Database and application configuration.
"""
import os

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    # Load from parent directory (project root)
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    load_dotenv(env_path)
except ImportError:
    # dotenv not installed, use system environment variables
    pass

# Database configuration for Dejavu
DATABASE_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "db": os.getenv("DB_NAME", "gurbani_db"),
}

# Flask configuration
FLASK_CONFIG = {
    "host": "0.0.0.0",
    "port": int(os.getenv("FLASK_PORT", 5000)),
    "debug": os.getenv("FLASK_DEBUG", "True").lower() == "true",
}

# GurbaniNow API configuration
GURBANI_API_URL = os.getenv("GURBANI_API_URL", "https://api.gurbaninow.com/v2")

# Audio processing configuration
AUDIO_CONFIG = {
    "allowed_extensions": [".wav", ".mp3", ".m4a"],
    "max_file_size": 10 * 1024 * 1024,  # 10MB
    "temp_directory": "temp_audio",
}

