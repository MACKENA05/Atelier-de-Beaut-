from datetime import datetime,timezone
from extensions import db
from slugify import slugify 
from models.product import product_category

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(110), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_urls = db.Column(db.JSON)
    is_featured = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    # Parent category ID (for subcategories)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)

    # Define a relationship to parent (self-referential)
    parent = db.relationship('Category', remote_side=[id], backref='subcategories', lazy=True)

    # Relationships
    products = db.relationship(
        'Product', 
        secondary=product_category,
        back_populates='categories',
        lazy='dynamic' # or 'joined' if you always want to load products
    )
    def generate_slug(self):
        if not self.name:
            raise ValueError("Category name is required to generate slug")
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 1
        while Category.query.filter(Category.slug == slug, Category.id != self.id).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        self.slug = slug

    def __repr__(self):
        return f'<Category {self.name}>'
    



# we have this categories on a navbar
#all products
# # by brands
# #makeup
# #fragrance
# #Hairecare
# #SkinCare
# #Accessories
# #Deals
# and we have filtering by price
