from datetime import datetime, timezone
from app import db
from slugify import slugify
from sqlalchemy import event

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    discount_price = db.Column(db.Float, nullable=True)
    stock_quantity = db.Column(db.Integer, nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    brand = db.Column(db.String(50), nullable=True)
    image_urls = db.Column(db.ARRAY(db.String), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)

    categories = db.relationship(
        'Category',
        secondary='product_category',  # Assuming product_category is your association table
        back_populates='products'
    )

    def generate_slug(self):
        """Generate a slug based on the product name."""
        self.slug = slugify(self.name)

    def __repr__(self):
        return f'<Product {self.name}>'

# Event listener to auto-generate the slug before insert
@event.listens_for(Product, 'before_insert')
def generate_slug_before_insert(mapper, connection, target):
    if not target.slug:  # Check if slug is already set
        target.generate_slug()
