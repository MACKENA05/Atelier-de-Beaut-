from flask import Blueprint, jsonify, request, abort
from schemas.product_schema import ProductSchema
from schemas.category_schema import CategorySchema
from services.product_service import ProductService
from services.category_service import CategoryService
from utils.decorators import admin_or_manager_required
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

products_bp = Blueprint('api', __name__)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

logger = logging.getLogger(__name__)

@products_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        is_featured = request.args.get('is_featured', type=bool)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        price_order = request.args.get('priceOrder', type=str)
        search_term = request.args.get('search', type=str)

        logger.debug(f"get_all_products called with page={page}, per_page={per_page}, is_featured={is_featured}, min_price={min_price}, max_price={max_price}, price_order={price_order}, search_term={search_term}")

        result = ProductService.get_all_products(page, per_page, is_featured, min_price, max_price, price_order, search_term)
        return jsonify({
            'items': products_schema.dump(result['items']),
            'total': result['total'],
            'pages': result['pages'],
            'current_page': result['current_page'],
            'per_page': result['per_page']
        }), 200
    except Exception as e:
        logger.error(f"Error in get_all_products: {str(e)}")
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/categories/<int:category_id>/products', methods=['GET'])
def get_products_by_category_id(category_id):
    """Get products in a specific category by ID with pagination."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        price_order = request.args.get('priceOrder', type=str)
        search_term = request.args.get('search', type=str)

        result = ProductService.get_products_by_category(category_id, page, per_page, price_order, search_term)
        return jsonify({
            'products': {
                'items': products_schema.dump(result['items']),
                'total': result['total'],
                'pages': result['pages'],
                'current_page': result['current_page'],
                'per_page': result['per_page']
            }
        }), 200
    except Exception as e:
        logger.error(f"Error in get_products_by_category_id: {str(e)}")
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/categories', methods=['GET'])
def get_all_categories():
    """Get all top-level categories with subcategories."""
    try:
        categories = CategoryService.get_all_categories()
        return jsonify(categories), 200
    except Exception as e:
        logger.error(f"Error in get_all_categories: {str(e)}")
        return jsonify({'error': str(e)}), 500
