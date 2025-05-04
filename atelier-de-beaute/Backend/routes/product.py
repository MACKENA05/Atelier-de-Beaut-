from flask import Blueprint, jsonify
from models.product import Product

product_bp = Blueprint('product', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(is_active=True).all()
    product_list = [product.to_dict() for product in products]
    return jsonify(product_list)
