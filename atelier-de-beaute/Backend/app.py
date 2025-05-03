from flask import Flask, jsonify, request
from config import config
from extensions import db, migrate, jwt, cache,cors
from models.user import User
import logging
from logging.handlers import RotatingFileHandler

def create_app(config_name='development'):
    app = Flask(__name__)
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
    cors.init_app(app)
    

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

    # from models.category import Category
    # from models.product import Product
    # from models.user import User
    # from models.cart import Cart,CartItem

    # Register blueprints and error handlers
    with app.app_context():
        from routes.auth import auth_bp
        from routes.admin import admin_bp
        from routes.products import products_bp
        from routes.cart import cart_bp     
        from routes.orders import orders_bp
        from utils.validators import handle_404, handle_500
        from routes.payment import payments_bp
        from routes.review import reviews_bp
        from routes.analytics import analytics_bp

        
        app.register_blueprint(payments_bp, url_prefix = '/payment')
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(admin_bp, url_prefix='/admin')
        app.register_blueprint(products_bp,url_prefix='/products')
        app.register_blueprint(cart_bp, url_prefix='/api')
        app.register_blueprint(orders_bp, url_prefix='/orders')
        app.register_blueprint(reviews_bp, url_prefix='/api')
        app.register_blueprint(analytics_bp, url_prefix = '/analytic')
 

        app.register_error_handler(404, handle_404)
        app.register_error_handler(500, handle_500)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)