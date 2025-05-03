from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.review_service import ReviewService
from schemas.reviews_schema import ReviewSchema, ReviewsSchema
from models.user import UserRole
from utils.decorators import admin_or_manager_required, customer_required
import logging

reviews_bp = Blueprint('reviews', __name__)
logger = logging.getLogger(__name__)

@reviews_bp.route('/reviews', methods=['POST'])
@jwt_required()
@customer_required
def create_review():
    try:
        data = request.get_json()
        logger.info(f"Create review request: {data}")
        current_user_id = get_jwt_identity()
        logger.debug(f"Raw user_id from JWT: {current_user_id} (type: {type(current_user_id)})")
        current_user_id = int(current_user_id)  # Ensure integer
        claims = get_jwt()
        user_role = UserRole(claims['role'].lower())
        review = ReviewService.create_review(data, current_user_id, user_role)
        return jsonify(ReviewSchema().dump(review)), 201
    except ValueError as e:
        logger.error(f"ValueError creating review: {str(e)}")
        return jsonify({'error': str(e)}), 400

@reviews_bp.route('/api/reviews/<int:review_id>', methods=['GET'])
@jwt_required()
def get_review(review_id):
    try:
        review = ReviewService.get_review(review_id, eager_load=True)
        if not review:
            return jsonify({"error": "Review not found"}), 404
        return jsonify(ReviewSchema().dump(review)), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@reviews_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    try:
        data = request.get_json()
        logger.info(f"Update review request for ID {review_id}: {data}")
        current_user_id = int(get_jwt_identity())  # Ensure integer
        claims = get_jwt()
        user_role = UserRole(claims['role'].lower())
        review = ReviewService.update_review(review_id, data, current_user_id, user_role)
        return jsonify(ReviewSchema().dump(review)), 200
    except ValueError as e:
        logger.error(f"ValueError updating review ID {review_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except PermissionError as e:
        logger.error(f"PermissionError updating review ID {review_id}: {str(e)}")
        return jsonify({'error': str(e)}), 403

@reviews_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    try:
        current_user_id = get_jwt_identity()
        logger.debug(f"Raw user_id from JWT: {current_user_id} (type: {type(current_user_id)})")
        current_user_id = int(current_user_id)  # Ensure integer
        claims = get_jwt()
        user_role = UserRole(claims['role'].lower())
        logger.info(f"Delete review request for ID {review_id} by user ID {current_user_id}, role: {user_role}")
        ReviewService.delete_review(review_id, current_user_id, user_role)
        return jsonify({'message': 'Review deleted'}), 200
    except ValueError as e:
        logger.error(f"ValueError deleting review ID {review_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except PermissionError as e:
        logger.error(f"PermissionError deleting review ID {review_id}: {str(e)}")
        return jsonify({'error': str(e)}), 403

@reviews_bp.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    try:
        reviews = ReviewService.get_reviews(product_id=product_id, eager_load=True)
        return jsonify(ReviewsSchema().dump({'reviews': reviews})), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@reviews_bp.route('/reviews/featured', methods=['GET'])
def get_featured_reviews():
    try:
        product_id = request.args.get('product_id', type=int)
        reviews = ReviewService.get_featured_reviews(product_id=product_id, eager_load=True)
        return jsonify(ReviewsSchema().dump({'reviews': reviews})), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@reviews_bp.route('/reviews/<int:review_id>/toggle-featured', methods=['PATCH'])
@jwt_required()
@admin_or_manager_required
def toggle_featured(review_id):
    try:
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = UserRole(claims['role'].lower())
        review = ReviewService.toggle_featured(review_id, current_user_id, user_role)
        return jsonify(ReviewSchema().dump(review)), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

