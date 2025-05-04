from flask import Flask
from flask_cors import CORS
from utils.validators import handle_404, handle_500
from config import Config 
from extensions import db, migrate, jwt, cache

import logging
from flask import Flask

def create_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)

    # Enable CORS for frontend origin with credentials support and all routes
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.product import product_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(product_bp, url_prefix='/api')
   
    with app.app_context():
        db.create_all()

    app.register_error_handler(404, handle_404)
    app.register_error_handler(500, handle_500)

    return app


