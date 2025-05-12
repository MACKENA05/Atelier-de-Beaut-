from flask import Flask, jsonify, request
from config import config
from extensions import db, migrate, jwt, cache,cors
from models.user import User
import logging
from logging.handlers import RotatingFileHandler

import os
from flask import send_from_directory

def create_app(config_name='development'):
    app = Flask(__name__, static_folder='../frontend/public', static_url_path='/')

    app.config.from_object(config[config_name])

    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    handler = RotatingFileHandler('app.log', maxBytes=1000000, backupCount=5)
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    logger.addHandler(handler)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)
    cors_origins = [origin.strip() for origin in app.config.get('CORS_ORIGINS', '').split(',')]
    cors.init_app(app, resources={r"/api/*": {"origins": cors_origins}})

    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        logger.warning(f"Invalid token from {request.remote_addr}: {str(error)}")
        return jsonify({"error": "Invalid token", "details": str(error), "status": 401}), 401

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        logger.warning(f"Missing token from {request.remote_addr}: {str(error)}")
        return jsonify({"error": "Missing authentication token", "details": str(error), "status": 401}), 401

    # JWT user lookup callback
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data['sub']  # 'sub' contains str(user.id)
        logger.debug(f"Looking up user with identity: {identity}")
        try:
            user = User.query.filter_by(id=int(identity)).first()
            if not user:
                logger.warning(f"No user found for identity: {identity}")
            return user
        except ValueError:
            logger.error(f"Invalid identity format: {identity}")
            return None

    # Register blueprints and error handlers
    with app.app_context():
        from routes.auth import auth_bp
        from routes.admin import admin_bp
        from routes.products import products_bp
        from routes.cart import cart_bp
        from routes.orders import orders_bp
        from routes.payment import payments_bp
        from routes.review import reviews_bp
        from routes.analytics import analytics_bp
        from utils.validators import handle_404, handle_500

        app.register_blueprint(payments_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api')
        app.register_blueprint(admin_bp, url_prefix='/api')
        app.register_blueprint(products_bp, url_prefix='/api')
        app.register_blueprint(cart_bp, url_prefix='/api')
        app.register_blueprint(orders_bp, url_prefix='/api')
        app.register_blueprint(reviews_bp, url_prefix='/api')
        app.register_blueprint(analytics_bp, url_prefix='/api')

        app.register_error_handler(404, handle_404)
        app.register_error_handler(500, handle_500)

    # Catch-all route to serve frontend index.html for SPA routing
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api'):
            return jsonify({"error": "API route not found"}), 404
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)