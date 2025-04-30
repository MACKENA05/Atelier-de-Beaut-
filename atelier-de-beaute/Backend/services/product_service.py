from app import db
from models.product import Product
from models.product import product_category
from sqlalchemy.exc import SQLAlchemyError

class ProductService:
    @staticmethod
    def get_all_products(page, per_page, is_featured=None, min_price=None, max_price=None):
        try:
            query = Product.query.filter_by(is_active=True)

            if is_featured is not None:
                query = query.filter_by(is_featured=is_featured)
            if min_price is not None:
                query = query.filter(Product.price >= min_price)
            if max_price is not None:
                query = query.filter(Product.price <= max_price)

            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_product_by_id(product_id):
        try:
            product = Product.query.filter_by(id=product_id, is_active=True).first()
            if not product:
                raise ValueError("Product not found")
            return product
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_product_by_slug(slug):
        try:
            product = Product.query.filter_by(slug=slug, is_active=True).first()
            if not product:
                raise ValueError(f"Product with slug '{slug}' not found")
            return product
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_products_by_category(category_id, page, per_page):
        try:
            query = Product.query.join(product_category).filter(
                product_category.c.category_id == category_id
            ).filter(Product.is_active == True)

            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_featured_products(page, per_page):
        try:
            query = Product.query.filter_by(is_active=True, is_featured=True)
            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_deals(page, per_page):
        try:
            query = Product.query.filter(
                Product.is_active == True,
                Product.discount_price.isnot(None)
            )
            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError:
            raise Exception("Database error occurred")