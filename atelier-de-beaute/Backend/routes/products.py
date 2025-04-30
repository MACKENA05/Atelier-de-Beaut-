from flask import Blueprint, jsonify, request, abort
from schemas.product_schema import ProductSchema
from schemas.category_schema import CategorySchema
from services.product_service import ProductService
from services.category_service import CategoryService

products_bp = Blueprint('api', __name__)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

@products_bp.route('/', methods=['GET'])
def get_all_products():
    """Get all products with pagination and optional filtering."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        is_featured = request.args.get('is_featured', type=bool)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)

        result = ProductService.get_all_products(page, per_page, is_featured, min_price, max_price)
        return jsonify({
            'items': products_schema.dump(result['items']),
            'total': result['total'],
            'pages': result['pages'],
            'current_page': result['current_page'],
            'per_page': result['per_page']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    """Get a specific product by ID."""
    try:
        product = ProductService.get_product_by_id(product_id)
        return jsonify(product_schema.dump(product)), 200
    except ValueError as e:
        abort(404, description=str(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    """Get a specific product by slug."""
    try:
        product = ProductService.get_product_by_slug(slug)
        return jsonify(product_schema.dump(product)), 200
    except ValueError as e:
        abort(404, description=str(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories/<int:category_id>/products', methods=['GET'])
def get_products_by_category_id(category_id):
    """Get products in a specific category by ID with pagination."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        category = CategoryService.get_category_by_id(category_id)
        result = ProductService.get_products_by_category(category_id, page, per_page)
        return jsonify({
            'category': category_schema.dump(category),
            'products': {
                'items': products_schema.dump(result['items']),
                'total': result['total'],
                'pages': result['pages'],
                'current_page': result['current_page'],
                'per_page': result['per_page']
            }
        }), 200
    except ValueError as e:
        abort(404, description=str(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories/<slug>/products', methods=['GET'])
def get_products_by_category_slug(slug):
    """Get products in a specific category by slug with pagination."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        category = CategoryService.get_category_by_slug(slug)
        result = ProductService.get_products_by_category(category.id, page, per_page)
        return jsonify({
            'category': category_schema.dump(category),
            'products': {
                'items': products_schema.dump(result['items']),
                'total': result['total'],
                'pages': result['pages'],
                'current_page': result['current_page'],
                'per_page': result['per_page']
            }
        }), 200
    except ValueError as e:
        abort(404, description=str(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_all_categories():
    """Get all categories with their hierarchy."""
    try:
        categories = CategoryService.get_all_categories()
        return jsonify(categories_schema.dump(categories)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories/<slug>', methods=['GET'])
def get_category_by_slug(slug):
    """Get a specific category by slug."""
    try:
        category = CategoryService.get_category_by_slug(slug)
        return jsonify(category_schema.dump(category)), 200
    except ValueError as e:
        abort(404, description=str(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products with pagination."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        result = ProductService.get_featured_products(page, per_page)
        return jsonify({
            'items': products_schema.dump(result['items']),
            'total': result['total'],
            'pages': result['pages'],
            'current_page': result['current_page'],
            'per_page': result['per_page']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/deals', methods=['GET'])
def get_deals():
    """Get products with discounts (deals)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        result = ProductService.get_deals(page, per_page)
        return jsonify({
            'items': products_schema.dump(result['items']),
            'total': result['total'],
            'pages': result['pages'],
            'current_page': result['current_page'],
            'per_page': result['per_page']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': error.description}), 404