import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 7200))
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'fallback@example.com')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'fallback_password')

    # M-Pesa Sandbox Credentials
    CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    PASSKEY = os.getenv('MPESA_PASSKEY')
    SHORTCODE = os.getenv("MPESA_SHORTCODE")  
    CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")  
    SANDBOX_URL = "https://sandbox.safaricom.co.ke"
    TEST_PHONE_NUMBER = "254708374149" 
    AMOUNT = "1"  


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