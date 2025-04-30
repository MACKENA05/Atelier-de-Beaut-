from app import db
from models.category import Category
from sqlalchemy.exc import SQLAlchemyError

class CategoryService:
    @staticmethod
    def get_category_by_id(category_id):
        try:
            category = Category.query.get(category_id)
            if not category:
                raise ValueError("Category not found")
            return category
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_category_by_slug(slug):
        try:
            category = Category.query.filter_by(slug=slug).first()
            if not category:
                raise ValueError(f"Category with slug '{slug}' not found")
            return category
        except SQLAlchemyError:
            raise Exception("Database error occurred")

    @staticmethod
    def get_all_categories():
        try:
            top_level_categories = Category.query.filter_by(parent_id=None).order_by(Category.display_order).all()
            return top_level_categories
        except SQLAlchemyError:
            raise Exception("Database error occurred")