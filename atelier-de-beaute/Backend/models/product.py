from datetime import datetime, timezone
from app import db
import re
from slugify import slugify 

# Association table for many-to-many relationship
product_category = db.Table('product_category',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=db.func.current_timestamp()),
    extend_existing=True
)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(110), unique=True, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    discount_price = db.Column(db.Float)
    stock_quantity = db.Column(db.Integer, default=0)
    sku = db.Column(db.String(50), unique=True)
    brand = db.Column(db.String(50))
    image_urls = db.Column(db.JSON)  # List of image URLs
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, nullable=False, default=0)
    cart_adds = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    order_items = db.relationship('OrderItem', back_populates='product', lazy=True)
    reviews = db.relationship('Review', back_populates='product', lazy=True, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', back_populates='product', lazy='dynamic')
    categories = db.relationship(
        'Category', 
        secondary=product_category,
        back_populates='products',
        lazy='dynamic'
    )

    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.price
    
    @property
    def discount_percentage(self):
        if self.discount_price and self.price:
            return round(((self.price - self.discount_price) / self.price) * 100, 1)
        return 0
    
    @property
    def average_rating(self):
        if not self.reviews:
            return 0
        return round(sum(review.rating for review in self.reviews) / len(self.reviews), 1)
    
    @property
    def review_count(self):
        return len(self.reviews)
    
    def validate_sku(self, key, sku):
        if not re.match(r'^[A-Za-z0-9\-]+$', sku):
            raise ValueError('SKU must only contain alphanumeric characters and hyphens.')
        return sku
    
    def generate_slug(self):
        if not self.slug:
            self.slug = slugify(self.name)
    
    def __repr__(self):
        return f'<Product {self.name}>'