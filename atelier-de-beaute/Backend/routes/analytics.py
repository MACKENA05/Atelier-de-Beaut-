from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.analytics_service import AnalyticsService
from http import HTTPStatus
import logging
from utils.decorators import admin_or_manager_required

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/analytic/sales', methods=['GET'])
@admin_or_manager_required
def get_sales_analytics():
    """Returns total revenue from completed orders within a specified time period."""
    try:
        period = request.args.get('period', 'monthly')
        result = AnalyticsService.get_sales_analytics(period)
        logger.info(f"Sales analytics retrieved for period={period}: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving sales analytics: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/orders', methods=['GET'])
@admin_or_manager_required
def get_order_analytics():
    """Returns order-related statistics."""
    try:
        result = AnalyticsService.get_order_analytics()
        logger.info(f"Order analytics retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving order analytics: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/users', methods=['GET'])
@admin_or_manager_required
def get_user_analytics():
    """Returns user-related statistics."""
    try:
        result = AnalyticsService.get_user_analytics()
        logger.info(f"User analytics retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving user analytics: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/top-products', methods=['GET'])
@admin_or_manager_required
def get_top_products():
    """Returns the top 10 best-selling products by quantity sold."""
    try:
        result = AnalyticsService.get_top_products()
        logger.info(f"Top products retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving top products: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/revenue-by-category', methods=['GET'])
@admin_or_manager_required
def get_revenue_by_category():
    """Returns revenue generated per product category."""
    try:
        result = AnalyticsService.get_revenue_by_category()
        logger.info(f"Revenue by category retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving revenue by category: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/conversion-rates', methods=['GET'])
@admin_or_manager_required
def get_conversion_rates():
    """Returns conversion metrics for user engagement and sales funnel."""
    try:
        result = AnalyticsService.get_conversion_rates()
        logger.info(f"Conversion rates retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving conversion rates: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@analytics_bp.route('/analytic/overview', methods=['GET'])
@admin_or_manager_required
def get_analytics_overview():
    """Returns a summary of total sales, orders, and users."""
    try:
        result = AnalyticsService.get_analytics_overview()
        logger.info(f"Analytics overview retrieved: {result}")
        return jsonify(result), HTTPStatus.OK
    except Exception as e:
        logger.error(f"Error retrieving analytics overview: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR