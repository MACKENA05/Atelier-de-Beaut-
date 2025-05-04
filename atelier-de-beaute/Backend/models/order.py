from datetime import datetime, timezone
from enum import Enum
import re
from extensions import db
from sqlalchemy.orm import validates
import logging

logger = logging.getLogger(__name__)

class PaymentStatus(str, Enum):
    INITIATED = 'initiated'
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'

class DeliveryStatus(str, Enum):
    PENDING = 'pending'
    SHIPPED = 'shipped'
    DELIVERED = 'delivered'

class OrderStatus(str, Enum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    shipping_cost = db.Column(db.Float, nullable=False, default=0.0)
    payment_status = db.Column(db.String(20), nullable=False)
    delivery_status = db.Column(db.String(20), nullable=False)
    shipping_method = db.Column(db.String(50))
    payment_method = db.Column(db.String(50))
    transaction_id = db.Column(db.String(50))
    order_status = db.Column(db.String(20), nullable=False, default=OrderStatus.PENDING.value)
    checkout_request_id = db.Column(db.String(50))  # Added for M-Pesa STK Push
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    address = db.relationship('Address', back_populates='order', uselist=False, cascade='all, delete-orphan')
    invoice = db.relationship('Invoice', back_populates='order', uselist=False, cascade='all, delete-orphan')

    
    def update_order_status(self):
        """Automatically set order_status based on payment_status and delivery_status."""
        logger.debug(f"Updating order_status for order_id={self.id or 'new'}: "
                     f"payment_status={self.payment_status}, delivery_status={self.delivery_status}")
        try:
            if not self.payment_status or not self.delivery_status:
                self.order_status = OrderStatus.PENDING.value
                logger.warning(f"Set order_status={self.order_status} for order_id={self.id or 'new'} "
                               f"(missing payment or delivery status)")
                return
            if self.payment_status not in [status.value for status in PaymentStatus]:
                logger.error(f"Invalid payment_status: {self.payment_status}")
                raise ValueError(f"Invalid payment_status: {self.payment_status}")
            if self.delivery_status not in [status.value for status in DeliveryStatus]:
                logger.error(f"Invalid delivery_status: {self.delivery_status}")
                raise ValueError(f"Invalid delivery_status: {self.delivery_status}")
            if self.payment_status == PaymentStatus.FAILED.value:
                self.order_status = OrderStatus.CANCELLED.value
            elif (self.payment_status == PaymentStatus.COMPLETED.value and 
                  self.delivery_status == DeliveryStatus.DELIVERED.value):
                self.order_status = OrderStatus.COMPLETED.value
            elif (self.payment_status in [PaymentStatus.INITIATED.value, PaymentStatus.COMPLETED.value] or 
                  self.delivery_status in [DeliveryStatus.SHIPPED.value, DeliveryStatus.DELIVERED.value]):
                self.order_status = OrderStatus.PROCESSING.value
            else:
                self.order_status = OrderStatus.PENDING.value
            logger.info(f"Set order_status={self.order_status} for order_id={self.id or 'new'}")
        except Exception as e:
            logger.error(f"Error in update_order_status for order_id={self.id or 'new'}: {str(e)}")
            self.order_status = OrderStatus.PENDING.value
            raise

    @validates('shipping_method')
    def validate_shipping_method(self, key, value):
        if value and value not in ['standard', 'express']:
            raise ValueError("Shipping method must be 'standard' or 'express'")
        return value

    @validates('payment_method')
    def validate_payment_method(self, key, value):
        if value not in ['mpesa', 'pay_on_delivery']:
            raise ValueError("Payment method must be 'mpesa' or 'pay_on_delivery'")
        return value

    @validates('order_status')
    def validate_order_status(self, key, value):
        if value not in [status.value for status in OrderStatus]:
            raise ValueError(f"Order status must be one of: {', '.join(status.value for status in OrderStatus)}")
        return value

    @validates('payment_status')
    def validate_payment_status(self, key, value):
        if value not in [status.value for status in PaymentStatus]:
            raise ValueError(f"Payment status must be one of: {', '.join(status.value for status in PaymentStatus)}")
        return value

    @validates('delivery_status')
    def validate_delivery_status(self, key, value):
        if value not in [status.value for status in DeliveryStatus]:
            raise ValueError(f"Delivery status must be one of: {', '.join(status.value for status in DeliveryStatus)}")
        return value

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', back_populates='items')
    product = db.relationship('Product', back_populates='order_items')

    __table_args__ = (
        db.CheckConstraint('quantity >= 1', name='check_quantity_positive'),
        db.UniqueConstraint('order_id', 'product_id', name='unique_order_product'),
    )

class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    postal_address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=True)

    order = db.relationship('Order', back_populates='address')

    @validates('phone')
    def validate_phone(self, key, phone):
        cleaned_phone = re.sub(r'[\s\-\(\)]+', '', phone)
        if not re.match(r'^\+?\d{9,15}$', cleaned_phone):
            raise ValueError('Phone number must be 9-15 digits, optionally starting with +')
        if cleaned_phone.startswith('0'):
            cleaned_phone = '+254' + cleaned_phone[1:]  # Assumes Kenyan numbers
        return cleaned_phone

class Invoice(db.Model):
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    invoice_number = db.Column(db.String(20), nullable=False, unique=True)
    total = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(50), nullable=True)
    issued_at = db.Column(db.DateTime(timezone=True), default=datetime.now(timezone.utc))
    status = db.Column(db.String(20), nullable=False, default=PaymentStatus.PENDING.value)

    order = db.relationship('Order', back_populates='invoice')