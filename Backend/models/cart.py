from app import db
from datetime import datetime

class Cart(db.Model):
    __tablename__ = 'carts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.current_timestamp(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.current_timestamp(), nullable=False)

    user = db.relationship('User', back_populates='carts')
    items = db.relationship('CartItem', back_populates='cart', lazy='dynamic')

    def __repr__(self):
        return f'<Cart id={self.id} user_id={self.user_id}>'


class CartItem(db.Model):
    __tablename__ = 'cart_items'
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id', ondelete='CASCADE'), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.current_timestamp(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=db.func.current_timestamp(), nullable=False)
    
    product = db.relationship('Product', back_populates='cart_items')
    cart = db.relationship('Cart', back_populates='items')

    __table_args__ = (
        db.CheckConstraint('quantity >= 1', name='check_quantity_positive'),
    )

    def __repr__(self):
        return f'<CartItem cart_id={self.cart_id} product_id={self.product_id} quantity={self.quantity}>'