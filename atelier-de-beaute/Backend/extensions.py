from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_caching import Cache
from flask_cors import CORS
from flask_session import Session


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()
cors = CORS()
session = Session()