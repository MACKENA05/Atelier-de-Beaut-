from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')

# In-memory cart storage for demonstration (replace with DB in production)
user_carts = {}

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = user_carts.get(user_id, [])
    return jsonify({"cart": cart}), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    cart = user_carts.setdefault(user_id, [])
    # Check if product already in cart
    for item in cart:
        if item['product_id'] == product_id:
            item['quantity'] += quantity
            break
    else:
        cart.append({"product_id": product_id, "quantity": quantity})

    return jsonify({"message": "Product added to cart", "cart": cart}), 200

@cart_bp.route('/remove', methods=['POST'])
@jwt_required()
def remove_from_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    cart = user_carts.get(user_id, [])
    cart = [item for item in cart if item['product_id'] != product_id]
    user_carts[user_id] = cart

    return jsonify({"message": "Product removed from cart", "cart": cart}), 200
