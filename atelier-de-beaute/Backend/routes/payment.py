
from flask import Blueprint, request, jsonify
from utils.decorators import customer_required
from models.order import Order, PaymentStatus
from extensions import db
from mpesa_gateway import MpesaGateway
import logging
from datetime import datetime, timezone
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import get_jwt_identity
import os

payments_bp = Blueprint('payments', __name__)
logger = logging.getLogger(__name__)

@payments_bp.route('/checkout/<int:order_id>', methods=['POST'])
@customer_required
def initiate_mpesa_payment(order_id):
    try:
        current_user_id = get_jwt_identity()
        # Verify order exists and belongs to the current user
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        if not order:
            logger.error(f"Order {order_id} not found or does not belong to user {current_user_id}")
            return jsonify({'error': 'Order not found or unauthorized'}), 404

        if order.payment_status == PaymentStatus.COMPLETED.value:
            return jsonify({'error': 'Payment already completed'}), 400

        # Get payment details from request or order
        data = request.get_json() or {}
        phone_number = data.get('phone_number', order.address.phone.replace('+', ''))  # Use order address phone
        simulate_mpesa = os.getenv('MPESA_ENVIRONMENT', 'sandbox') == 'local'

        # Validate phone number format
        if not phone_number.startswith('254') or len(phone_number) != 12:
            logger.error(f"Invalid phone number format: {phone_number}")
            return jsonify({'error': 'Invalid phone number', 'details': 'Must be 12 digits starting with 254'}), 400

        # Validate and format amount
        amount_float = float(order.total + order.shipping_cost)
        if amount_float <= 0:
            logger.error(f"Invalid order total for order {order_id}: {amount_float}")
            return jsonify({'error': 'Invalid order total', 'details': 'Order total must be positive'}), 400

        # Handle M-Pesa payment
        if simulate_mpesa:
            # Simulate M-Pesa payment
            logger.info(f"Simulating M-Pesa payment for order {order_id} to {phone_number}")
            response_data = {
                "CheckoutRequestID": f"simulated_ws_CO_{order_id}",
                "ResponseCode": "0",
                "ResponseDescription": "Simulated success",
                "CustomerMessage": "Simulated M-Pesa request accepted"
            }
        else:
            # Initialize MpesaGateway for real payment
            mpesa = MpesaGateway()
            response_data = mpesa.stk_push(
                phone=phone_number,
                amount=amount_float,
                account_reference=f"Order{order_id}",
                description="Payment for Order"
            )

        if response_data.get('ResponseCode') != '0':
            order.payment_status = PaymentStatus.FAILED.value
            db.session.commit()
            return jsonify({
                'error': 'Failed to initiate payment',
                'details': response_data.get('ResponseDescription', 'Unknown error'),
                'message': 'Sorry, your payment didn’t go through. Please try again.'
            }), 400

        # Save M-Pesa transaction details
        order.checkout_request_id = response_data.get('CheckoutRequestID')
        order.payment_status = PaymentStatus.INITIATED.value
        order.invoice.checkout_request_id = response_data.get('CheckoutRequestID')
        order.invoice.status = PaymentStatus.INITIATED.value
        db.session.commit()

        logger.info(f"STK Push initiated for order {order_id}: {response_data}")
        return jsonify({
            'message': 'Payment initiated. Please check your phone to complete the payment.',
            'data': response_data,
            'order_id': order_id
        }), 200

    except SQLAlchemyError as e:
        logger.error(f"Database error for order {order_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': 'Failed to access order data'}), 500
    except ValueError as e:
        logger.error(f"ValueError initiating M-Pesa payment for order {order_id}: {str(e)}")
        return jsonify({'error': 'Payment initiation failed', 'details': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error initiating M-Pesa payment for order {order_id}: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@payments_bp.route('/callback', methods=['POST'])
def payment_callback():
    try:
        data = request.get_json()
        logger.info(f"Callback received: {data}")
        result_code = data['Body']['stkCallback']['ResultCode']
        checkout_id = data['Body']['stkCallback']['CheckoutRequestID']

        # Find order by checkout_request_id
        order = Order.query.filter_by(checkout_request_id=checkout_id).first()
        if not order:
            logger.error(f"No order found for checkout_request_id: {checkout_id}")
            return jsonify({'error': 'Order not found'}), 404

        if result_code == 0:
            # Success
            metadata = data['Body']['stkCallback'].get('CallbackMetadata', {}).get('Item', [])
            amount = next((item['Value'] for item in metadata if item['Name'] == 'Amount'), 0)
            receipt = next((item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber'), 'SIMULATED')
            order.payment_status = PaymentStatus.COMPLETED.value
            order.transaction_id = receipt
            order.invoice.status = PaymentStatus.COMPLETED.value
            order.invoice.transaction_id = receipt
            order.updated_at = datetime.now(timezone.utc)
            db.session.commit()
            logger.info(f"Payment completed for order {order.id}: receipt {receipt}")
            return jsonify({
                'status': 'success',
                'message': 'Your payment was successful! Your order has been placed.'
            }), 200
        else:
            # Failure
            result_desc = data['Body']['stkCallback']['ResultDesc']
            order.payment_status = PaymentStatus.FAILED.value
            order.invoice.status = PaymentStatus.FAILED.value
            db.session.commit()
            logger.error(f"Payment failed for order {order.id}: {result_desc}")
            return jsonify({
                'status': 'error',
                'message': 'Sorry, your payment didn’t go through. Please try again.',
                'order_id': order.id,
                'details': result_desc
            }), 200

    except Exception as e:
        logger.error(f"Error processing callback: {str(e)}")
        return jsonify({'error': 'Callback processing failed'}), 500

@payments_bp.route('/mpesa/retry/<int:order_id>', methods=['POST'])
@customer_required
def retry_mpesa_payment(order_id):
    try:
        current_user_id = get_jwt_identity()
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        if not order:
            logger.error(f"Order {order_id} not found or does not belong to user {current_user_id}")
            return jsonify({'error': 'Order not found or unauthorized'}), 404

        if order.payment_status == PaymentStatus.COMPLETED.value:
            return jsonify({'error': 'Payment already completed'}), 400

        # Get payment details from request or order
        data = request.get_json() or {}
        phone_number = data.get('phone_number', order.address.phone.replace('+', ''))  # Use order address phone
        simulate_mpesa = os.getenv('MPESA_ENVIRONMENT', 'sandbox') == 'local'

        # Validate phone number format
        if not phone_number.startswith('254') or len(phone_number) != 12:
            logger.error(f"Invalid phone number format: {phone_number}")
            return jsonify({'error': 'Invalid phone number', 'details': 'Must be 12 digits starting with 254'}), 400

        # Validate and format amount
        amount_float = float(order.total + order.shipping_cost)
        if amount_float <= 0:
            logger.error(f"Invalid order total for order {order_id}: {amount_float}")
            return jsonify({'error': 'Invalid order total', 'details': 'Order total must be positive'}), 400

        # Handle M-Pesa payment
        if simulate_mpesa:
            # Simulate M-Pesa payment
            logger.info(f"Simulating M-Pesa retry for order {order_id} to {phone_number}")
            response_data = {
                "CheckoutRequestID": f"simulated_ws_CO_{order_id}_retry",
                "ResponseCode": "0",
                "ResponseDescription": "Simulated success",
                "CustomerMessage": "Simulated M-Pesa request accepted"
            }
        else:
            # Initialize MpesaGateway for real payment
            mpesa = MpesaGateway()
            response_data = mpesa.stk_push(
                phone=phone_number,
                amount=amount_float,
                account_reference=f"Order{order_id}_Retry",
                description="Retry Payment for Order"
            )

        if response_data.get('ResponseCode') != '0':
            order.payment_status = PaymentStatus.FAILED.value
            order.invoice.status = PaymentStatus.FAILED.value
            db.session.commit()
            return jsonify({
                'error': 'Failed to initiate payment',
                'details': response_data.get('ResponseDescription', 'Unknown error'),
                'message': 'Sorry, your payment didn’t go through. Please try again.'
            }), 400

        # Save M-Pesa transaction details
        order.checkout_request_id = response_data.get('CheckoutRequestID')
        order.payment_status = PaymentStatus.INITIATED.value
        order.invoice.checkout_request_id = response_data.get('CheckoutRequestID')
        order.invoice.status = PaymentStatus.INITIATED.value
        db.session.commit()

        logger.info(f"STK Push retry initiated for order {order_id}: {response_data}")
        return jsonify({
            'message': 'Payment retry initiated. Awaiting confirmation.',
            'data': response_data,
            'order_id': order_id
        }), 200

    except SQLAlchemyError as e:
        logger.error(f"Database error for order {order_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': 'Failed to access order data'}), 500
    except ValueError as e:
        logger.error(f"ValueError retrying M-Pesa payment for order {order_id}: {str(e)}")
        return jsonify({'error': 'Payment retry failed', 'details': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error retrying M-Pesa payment for order {order_id}: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@payments_bp.route('/mpesa/status/<int:order_id>', methods=['GET'])
@customer_required
def check_payment_status(order_id):
    try:
        current_user_id = get_jwt_identity()
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        if not order:
            logger.error(f"Order {order_id} not found or does not belong to user {current_user_id}")
            return jsonify({'error': 'Order not found or unauthorized'}), 404

        if order.payment_status == PaymentStatus.COMPLETED.value:
            return jsonify({
                'status': 'completed',
                'message': 'Your payment was successful! Your order has been placed.',
                'order_id': order.id,
                'transaction_id': order.transaction_id
            }), 200
        elif order.payment_status in [PaymentStatus.INITIATED.value, PaymentStatus.FAILED.value]:
            return jsonify({
                'status': order.payment_status,
                'message': 'Sorry, your payment didn’t go through. Please try again.' if order.payment_status == PaymentStatus.FAILED.value else 'Your payment is still pending. Please complete the payment on your phone.',
                'order_id': order.id,
                'checkout_request_id': order.checkout_request_id
            }), 200
        else:
            return jsonify({
                'status': order.payment_status,
                'message': 'Payment status unknown.',
                'order_id': order.id
            }), 200

    except Exception as e:
        logger.error(f"Error checking payment status for order {order_id}: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
