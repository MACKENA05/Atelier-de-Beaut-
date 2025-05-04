from extensions import db
from sqlalchemy import func
from slugify import slugify

class Category(db.Model):
    __tablename__ = 'categories'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True, index=True)
    description = db.Column(db.Text)
    image_urls = db.Column(db.ARRAY(db.String))
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    slug = db.Column(db.String(255), unique=True, index=True)
    display_order = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)

    parent = db.relationship('Category', remote_side=[id], backref='children')

    def generate_slug(self):
        if self.name:
            self.slug = slugify(self.name)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image_urls': self.image_urls,
            'parent_id': self.parent_id,
            'slug': self.slug,
            'display_order': self.display_order,
            'is_featured': self.is_featured
        }

    def __repr__(self):
        return f'<Category id={self.id} name={self.name}>'
