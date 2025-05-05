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
    def serialize_category(category):
        """Recursively serialize category and its subcategories."""
        return {
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
            'description': category.description,
            'image_urls': category.image_urls,
            'is_featured': category.is_featured,
            'display_order': category.display_order,
            'subcategories': [CategoryService.serialize_category(subcat) for subcat in sorted(category.subcategories, key=lambda c: c.display_order)]
        }

    @staticmethod
    def get_all_categories():
        try:
            top_level_categories = Category.query.filter_by(parent_id=None).order_by(Category.display_order).all()
            # Serialize with subcategories recursively
            serialized = [CategoryService.serialize_category(cat) for cat in top_level_categories]
            return serialized
        except SQLAlchemyError:
            raise Exception("Database error occurred")
