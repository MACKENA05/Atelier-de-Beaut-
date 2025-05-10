from flask import Blueprint, request, jsonify
from utils.decorators import customer_required, admin_required, admin_or_manager_required,staff_required
from services.order_service import process_order, get_invoice_data, get_user_orders, get_all_orders, update_order_status
from models.order import PaymentStatus, DeliveryStatus, Order
from models.order import Invoice
from models.user import User, UserRole
from extensions import db
from mpesa_gateway import MpesaGateway
from flask_jwt_extended import get_jwt_identity
import logging
import os
from flask_cors import cross_origin

orders_bp = Blueprint('orders', __name__)
logger = logging.getLogger(__name__)

@orders_bp.route('/orders/checkout', methods=['POST'])  # Support both endpoints
@customer_required
def checkout():
    data = request.get_json()
    address_data = data.get('address')
    shipping_method = data.get('shipping_method')
    payment_method = data.get('payment_method')
    description = data.get('description')
    cod_phone = data.get('cod_phone') if payment_method == 'pay_on_delivery' else None
    phone_number = data.get('phone_number')
    simulate_mpesa = os.getenv('MPESA_ENVIRONMENT', 'sandbox') == 'local'

    # Validate required fields
    if not all([address_data, shipping_method, payment_method]):
        logger.error("Missing required fields in checkout request")
        return jsonify({"error": "Missing required fields"}), 400

    if shipping_method not in ['standard', 'express']:
        logger.error(f"Invalid shipping method: {shipping_method}")
        return jsonify({"error": "Invalid shipping method"}), 400

    if payment_method not in ['pay_on_delivery', 'mpesa']:
        logger.error(f"Invalid payment method: {payment_method}")
        return jsonify({"error": "Payment method must be 'mpesa' or 'pay_on_delivery'"}), 400

    # Validate payment method-specific fields
    if payment_method == 'mpesa':
        if not phone_number or not phone_number.startswith('254') or len(phone_number) != 12:
            logger.error(f"Invalid phone number for M-Pesa: {phone_number}")
            return jsonify({"error": "Invalid phone number", "details": "Must be 12 digits starting with 254"}), 400
    elif payment_method == 'pay_on_delivery' and not cod_phone:
        logger.error("Missing phone number for pay on delivery")
        return jsonify({"error": "Missing phone number for pay on delivery"}), 400

    try:
        order, invoice = process_order(
            address_data=address_data,
            billing_data={},  # Ignored, kept for compatibility
            shipping_method=shipping_method,
            payment_method=payment_method,
            description=description,
            cod_phone=cod_phone
        )

        # Handle payment responses
        payment_response = {}

        # Handle M-Pesa payment
        if payment_method == 'mpesa':
            if simulate_mpesa:
                # Simulate M-Pesa payment
                logger.info(f"Simulating M-Pesa payment for order {order.id} to {phone_number}")
                order.checkout_request_id = f"simulated_ws_CO_{order.id}"
                order.payment_status = PaymentStatus.INITIATED.value
                db.session.commit()
                response_data = {
                    "CheckoutRequestID": order.checkout_request_id,
                    "ResponseCode": "0",
                    "ResponseDescription": "Simulated success",
                    "CustomerMessage": "Simulated M-Pesa request accepted"
                }
            else:
                # Use MpesaGateway for real payment
                mpesa = MpesaGateway()
                response_data = mpesa.stk_push(
                    phone=phone_number,
                    amount=order.total,
                    account_reference=f"Order{order.id}",
                    description="Payment for Order"
                )
                order.checkout_request_id = response_data.get('CheckoutRequestID')
                order.payment_status = PaymentStatus.INITIATED.value
                db.session.commit()

            logger.info(f"M-Pesa payment initiated for order {order.id}: {response_data}")
            payment_response = {"mpesa_response": response_data}

        # Prepare response
        items_response = [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "product": {
                    "id": item.product.id,
                    "name": item.product.name,
                    "slug": item.product.slug,
                    "price": item.product.price,
                    "stock_quantity": item.product.stock_quantity
                }
            } for item in order.items
        ]

        address_response = {
            "full_name": order.address.full_name,
            "phone": order.address.phone,
            "postal_address": order.address.postal_address,
            "city": order.address.city,
            "country": order.address.country
        }

        invoice_response = {
            "invoice_number": invoice.invoice_number,
            "total": invoice.total,
            "status": invoice.status,
            "issued_at": invoice.issued_at.isoformat()
        }

        response = {
            "id": order.id,
            "user_id": order.user_id,
            "total": order.total,
            "shipping_cost": order.shipping_cost,
            "payment_status": order.payment_status,
            "delivery_status": order.delivery_status,
            "shipping_method": order.shipping_method,
            "payment_method": order.payment_method,
            "description": order.description,
            "created_at": order.created_at.isoformat(),
            "items": items_response,
            "address": address_response,
            "invoice": invoice_response
        }

        if payment_response:
            response.update(payment_response)

        return jsonify(response), 201

    except ValueError as ve:
        db.session.rollback()
        logger.error(f"Checkout error: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Checkout error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@orders_bp.route('/orders/my-orders', methods=['GET'])
@customer_required
def get_my_orders():
    user_id = get_jwt_identity()
    logger.info(f"Fetching orders for user_id: {user_id}")
    try:
        orders = get_user_orders()
        logger.info(f"Found {len(orders)} orders for user_id: {user_id}")
        return jsonify(orders), 200
    except Exception as e:
        logger.error(f"Error fetching user orders for user_id {user_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders', methods=['GET'])
@staff_required
def get_orders():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        paginated_orders = get_all_orders(page=page, per_page=per_page)
        return jsonify(paginated_orders), 200
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders/<int:order_id>/invoice', methods=['GET'])
@admin_required
def get_invoice(order_id):
    try:
        invoice_data = get_invoice_data(order_id)
        return jsonify(invoice_data), 200
    except ValueError as e:
        logger.error(f"Error fetching invoice for order {order_id}: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error fetching invoice for order {order_id}: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@orders_bp.route('/orders/invoices', methods=['GET'])
@admin_required
def get_all_invoices():
    try:
        invoices = Invoice.query.all()
        invoice_data = [{
            "invoice_number": invoice.invoice_number,
            "order_id": invoice.order_id,
            "user_id": Order.query.get(invoice.order_id).user_id,
            "total": invoice.total,
            "issued_at": invoice.issued_at.isoformat()
        } for invoice in invoices]
        return jsonify(invoice_data), 200
    except Exception as e:
        logger.error(f"Error fetching all invoices: {str(e)}")
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@staff_required
def update_order_status_route(order_id):
    data = request.get_json()
    payment_status = data.get('payment_status')
    delivery_status = data.get('delivery_status')

    if payment_status and payment_status not in [status.value for status in PaymentStatus]:
        logger.error(f"Invalid payment status: {payment_status}")
        return jsonify({"error": "Invalid payment status"}), 400
    if delivery_status and delivery_status not in [status.value for status in DeliveryStatus]:
        logger.error(f"Invalid delivery status: {delivery_status}")
        return jsonify({"error": "Invalid delivery status"}), 400

    try:
        updated_order = update_order_status(
            order_id=order_id,
            payment_status=payment_status,
            delivery_status=delivery_status
        )
        return jsonify(updated_order), 200
    except ValueError as e:
        logger.error(f"Error updating order {order_id} status: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error updating order {order_id} status: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
