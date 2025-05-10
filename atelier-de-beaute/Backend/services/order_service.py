import uuid
from flask_jwt_extended import get_jwt_identity
from extensions import db
from models.order import Order, OrderItem, Address, Invoice, PaymentStatus, DeliveryStatus
from models.user import User, UserRole
from models.product import Product
from services.cart_services import Cart_Services
from schemas.order_schema import InvoiceSchema, OrderSchema
import logging

logger = logging.getLogger(__name__)

def get_shipping_cost(shipping_method):
    # Calculate shipping cost based on the selected shipping method
    shipping_costs = {
        'standard': 1.00,
        'express': 300.00
    }
    return shipping_costs.get(shipping_method, 0.00)

def process_order(address_data, billing_data, shipping_method, payment_method, description=None, cod_phone=None):
    try:
        user_id = get_jwt_identity()
        cart_service = Cart_Services()

        # Fetch the user's cart from the database
        cart = cart_service.get_or_create_user_cart(user_id)
        if not cart.items:
            raise ValueError("Cart is empty")

        # Prepare order items from database cart, only including active products
        order_items = [
            {
                'product_id': item.product_id,
                'quantity': item.quantity,
                'unit_price': item.product.current_price
            } for item in cart.items if item.product.is_active
        ]
        if not order_items:
            raise ValueError("No active products in cart")

        # Verify stock availability
        for item in order_items:
            product = Product.query.get(item['product_id'])
            if product.stock_quantity < item['quantity']:
                raise ValueError(f"Insufficient stock for product {product.name}")

        # Calculate item total and shipping cost
        item_total = sum(item['quantity'] * item['unit_price'] for item in order_items)
        shipping_cost = get_shipping_cost(shipping_method)
        total = item_total + shipping_cost

        order = Order(
            user_id=user_id,
            total=total,
            shipping_cost=shipping_cost,
            payment_status=PaymentStatus.INITIATED.value if payment_method == 'mpesa' else PaymentStatus.PENDING.value,
            delivery_status=DeliveryStatus.PENDING.value,
            shipping_method=shipping_method,
            payment_method=payment_method,
            description=description
        )
        db.session.add(order)
        db.session.flush()

        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['product_id'],
                quantity=item['quantity'],
                unit_price=item['unit_price']
            )
            product = Product.query.get(item['product_id'])
            product.stock_quantity -= item['quantity']  # Update stock
            db.session.add(order_item)

        address = Address(
            order_id=order.id,
            full_name=address_data['full_name'],
            phone=cod_phone if payment_method == 'pay_on_delivery' else address_data['phone'],
            postal_address=address_data['postal_address'],
            city=address_data['city'],
            country=address_data.get('country')
        )
        db.session.add(address)

        if payment_method == 'mpesa':
            order.payment_status = PaymentStatus.INITIATED.value
            order.transaction_id = None
        else:  # pay_on_delivery
            order.payment_status = PaymentStatus.PENDING.value
            order.transaction_id = None

        invoice = Invoice(
            order_id=order.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total=total,
            transaction_id=order.transaction_id,
            status=order.payment_status
        )
        db.session.add(invoice)

        # Clear the cart after successful order
        cart_service.clear_cart(user_id)

        db.session.commit()
        return order, invoice

    except Exception as e:
        db.session.rollback()
        raise

def get_invoice_data(order_id):
    """
    Fetch invoice data for a given order ID using InvoiceSchema.
    Returns serialized invoice data with nested order, items, and address.
    Raises ValueError if order or invoice is not found.
    """
    try:
        # Fetch the order
        order = Order.query.get(order_id)
        if not order:
            raise ValueError(f"Order with ID {order_id} not found")

        # Fetch the invoice
        invoice = Invoice.query.filter_by(order_id=order_id).first()
        if not invoice:
            raise ValueError(f"Invoice for order ID {order_id} not found")

        # Fetch order items and address for context
        items = OrderItem.query.filter_by(order_id=order_id).all()
        address = Address.query.filter_by(order_id=order_id).first()
        if not items:
            raise ValueError(f"No items found for order ID {order_id}")
        if not address:
            raise ValueError(f"Address for order ID {order_id} not found")

        # Prepare schema with nested order data
        invoice_schema = InvoiceSchema()
        
        # Manually construct the data to include nested order
        invoice_data = invoice_schema.dump(invoice)
        invoice_data['order'] = OrderSchema().dump(order)

        return invoice_data

    except ValueError as e:
        logger.error(f"ValueError in get_invoice_data: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_invoice_data: {str(e)}")
        raise

from sqlalchemy.orm import joinedload
from sqlalchemy import desc

def get_user_orders():
    user_id = get_jwt_identity()
    orders = Order.query.options(
        joinedload(Order.items).joinedload(OrderItem.product),
        joinedload(Order.user)
    ).filter_by(user_id=user_id).order_by(desc(Order.created_at)).all()
    schema = OrderSchema(many=True)
    orders_data = schema.dump(orders)
    for order_obj, order_dict in zip(orders, orders_data):
        try:
            order_obj.update_order_status()
            order_dict['order_status'] = order_obj.order_status
        except Exception:
            order_dict['order_status'] = 'pending'
    return orders_data

def get_all_orders(page=1, per_page=10):
    pagination = Order.query.options(
        joinedload(Order.user),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).order_by(desc(Order.created_at)).paginate(page=page, per_page=per_page, error_out=False)

    orders = pagination.items
    schema = OrderSchema(many=True)
    orders_data = schema.dump(orders)
    for order_obj, order_dict in zip(orders, orders_data):
        try:
            order_obj.update_order_status()
            order_dict['order_status'] = order_obj.order_status
        except Exception:
            order_dict['order_status'] = 'pending'

    return {
        'items': orders_data,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'per_page': pagination.per_page
    }

def update_order_status(order_id, delivery_status=None, payment_status=None):
    order = Order.query.get(order_id)
    if not order:
        raise ValueError("Order not found")
    
    if delivery_status and delivery_status in [status.value for status in DeliveryStatus]:
        order.delivery_status = delivery_status
    if payment_status and payment_status in [status.value for status in PaymentStatus]:
        order.payment_status = payment_status
        if order.invoice:
            order.invoice.status = payment_status
        if payment_status == PaymentStatus.COMPLETED.value and order.payment_method == 'pay_on_delivery':
            order.transaction_id = f"POD-{uuid.uuid4().hex[:8].upper()}"
    
    db.session.commit()
    return OrderSchema().dump(order)
