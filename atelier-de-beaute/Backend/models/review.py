from datetime import datetime, timezone
from Backend.app import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    is_featured = db.Column(db.Boolean, default=False, nullable=False)  # New field

    product = db.relationship('Product', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    def __repr__(self):
        return f'<Review id={self.id} product_id={self.product_id} user_id={self.user_id}>'