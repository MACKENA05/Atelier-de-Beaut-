from datetime import datetime, timezone
from app import db
from slugify import slugify
from sqlalchemy import func


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(110), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_urls = db.Column(db.JSON)
    is_featured = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)

    parent = db.relationship('Category', remote_side=[id], backref='subcategories')
    
    
    def generate_slug(self):
        if not self.slug:
            self.slug = slugify(self.name)

    def __repr__(self):
        return f'<Category {self.name}>'

    @property
    def is_root_category(self):
        """Returns True if the category has no parent."""
        return self.parent_id is None
