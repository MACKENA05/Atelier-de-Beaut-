from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.cart_services import Cart_Services
import logging

cart_bp = Blueprint('cart', __name__)
logger = logging.getLogger(__name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required(optional=True)
def get_cart():
    """View all products in the cart."""
    user_id = get_jwt_identity()
    try:
        cart_data = Cart_Services.get_cart_data(user_id)
        return jsonify(cart_data), 200
    except ValueError as e:
        logger.error(f"Error fetching cart for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart/add', methods=['POST'])
@jwt_required(optional=True)
def add_to_cart():
    """Add an item to the cart."""
    user_id = get_jwt_identity()
    data = request.get_json()
    logger.info(f"Received data for add_to_cart: {data}")  # Added logging for debugging
    try:
        cart_item = Cart_Services.add_to_cart(user_id, data)
        from schemas.cart_schema import CartItemSchema
        serialized_item = CartItemSchema().dump(cart_item)
        response = jsonify(serialized_item)
    
        return response, 200
    except ValueError as e:
        logger.error(f"Error adding to cart for user {user_id}: {str(e)}")
        response = jsonify({'error': str(e)})
        return response, 400

@cart_bp.route('/cart/update', methods=['PUT'])
@jwt_required(optional=True)
def update_cart_item():
    """Update item quantity in the cart."""
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        Cart_Services.update_cart_item(user_id, data)
        return jsonify({'message': 'Cart item updated'}), 200
    except ValueError as e:
        logger.error(f"Error updating cart for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart/remove/<int:product_id>', methods=['DELETE'])
@jwt_required(optional=True)
def remove_from_cart(product_id):
    """Remove an item from the cart."""
    user_id = get_jwt_identity()
    try:
        Cart_Services.remove_from_cart(user_id, product_id)
        return jsonify({'message': 'Item removed from cart'}), 200
    except ValueError as e:
        logger.error(f"Error removing product {product_id} from cart for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@cart_bp.route('/cart/merge', methods=['POST'])
@jwt_required()
def merge_guest_cart():
    """Merge guest cart with authenticated user's cart."""
    user_id = get_jwt_identity()
    guest_cart = request.get_json()
    try:
        Cart_Services.merge_guest_cart(user_id, guest_cart)
        return jsonify({'message': 'Guest cart merged successfully'}), 200
    except ValueError as e:
        logger.error(f"Error merging guest cart for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400
    
@cart_bp.route('/cart', methods=['DELETE'])
@jwt_required(optional=True)
def clear_cart():
    """Clear all items from the cart."""
    user_id = get_jwt_identity()
    try:
        Cart_Services.clear_cart(user_id)
        return jsonify({'message': 'Cart cleared successfully'}), 200
    except ValueError as e:
        logger.error(f"Error clearing cart for user {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400