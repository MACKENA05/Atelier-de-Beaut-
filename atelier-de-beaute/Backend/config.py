import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres@localhost:5432/beauty_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'fallback@example.com')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'fallback_password')
    
    if not (300 <= JWT_ACCESS_TOKEN_EXPIRES <= 86400):  # 5min to 24h range
        raise ValueError("Invalid JWT expiration time")
    
    
    # Caching
    CACHE_TYPE = 'SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 3600

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    """Configuration for testing environment."""
    TESTING = True
    CACHE_TYPE = 'NullCache'
    JWT_ACCESS_TOKEN_EXPIRES = 10  # Short expiration for test tokens


class ProductionConfig(Config):
    Debug = False

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}