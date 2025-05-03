from extensions import db
from models.user import User
from models.order import Order, PaymentStatus  # Use PaymentStatus instead of OrderStatus
from models.order import OrderItem
from models.product import Product
from models.category import Category
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnalyticsService:
    @staticmethod
    def get_date_range(period):
        """Calculate start date based on period (daily, weekly, monthly)."""
        now = datetime.utcnow()
        if period == 'daily':
            start_date = now - timedelta(days=1)
        elif period == 'weekly':
            start_date = now - timedelta(days=7)
        elif period == 'monthly':
            start_date = now - timedelta(days=30)
        else:
            start_date = datetime.min  # All time
        logger.debug(f"Calculated date range for period={period}: start_date={start_date}")
        return start_date

    @staticmethod
    def get_sales_analytics(period):
        """Returns total revenue from completed orders within a specified time period."""
        try:
            start_date = AnalyticsService.get_date_range(period)
            total_revenue = db.session.query(db.func.sum(Order.total))\
                .filter(Order.payment_status == PaymentStatus.COMPLETED.value,  # Use payment_status
                        Order.created_at >= start_date)\
                .scalar() or 0.0
            result = {
                "period": period,
                "total_revenue": float(total_revenue),
                "start_date": start_date.isoformat()
            }
            logger.info(f"Sales analytics computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing sales analytics: {str(e)}")
            raise

    @staticmethod
    def get_order_analytics():
        """Returns order-related statistics."""
        try:
            order_stats = db.session.query(
                Order.payment_status,  # Use payment_status
                db.func.count(Order.id).label('count')
            ).group_by(Order.payment_status).all()
            
            stats = {
                "total_orders": 0,
                "completed": 0,
                "pending": 0,
                "cancelled": 0
            }
            
            for status, count in order_stats:
                stats["total_orders"] += count
                if status == PaymentStatus.COMPLETED.value:
                    stats["completed"] = count
                elif status == PaymentStatus.PENDING.value:
                    stats["pending"] = count
                elif status == PaymentStatus.FAILED.value:  # Treat FAILED as cancelled
                    stats["cancelled"] = count
            
            logger.info(f"Order analytics computed: {stats}")
            return stats
        except Exception as e:
            logger.error(f"Error computing order analytics: {str(e)}")
            raise

    @staticmethod
    def get_user_analytics():
        """Returns user-related statistics."""
        try:
            total_users = db.session.query(db.func.count(User.id)).scalar() or 0
            new_users = db.session.query(db.func.count(User.id))\
                .filter(User.created_at >= datetime.utcnow() - timedelta(days=30))\
                .scalar() or 0
            
            result = {
                "total_users": total_users,
                "new_users_last_30_days": new_users
            }
            logger.info(f"User analytics computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing user analytics: {str(e)}")
            raise

    @staticmethod
    def get_top_products():
        """Returns the top 10 best-selling products by quantity sold."""
        try:
            top_products = db.session.query(
                Product.name,
                db.func.sum(OrderItem.quantity).label('total_quantity')
            ).join(OrderItem, Product.id == OrderItem.product_id)\
             .group_by(Product.name)\
             .order_by(db.func.sum(OrderItem.quantity).desc())\
             .limit(10).all()
            
            result = [{"name": name, "total_quantity_sold": int(quantity)} for name, quantity in top_products]
            logger.info(f"Top products computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing top products: {str(e)}")
            raise

    @staticmethod
    def get_revenue_by_category():
        
        try:
            revenue_by_category = db.session.query(
                Category.name,
                db.func.sum(OrderItem.quantity * Product.price).label('total_revenue')
            ).join(
                product_category, product_category.c.category_id == Category.id
            ).join(
                Product, Product.id == product_category.c.product_id
            ).join(
                OrderItem, OrderItem.product_id == Product.id
            ).group_by(
                Category.name
            ).all()
    
            result = [{"category": name, "total_revenue": float(revenue)} for name, revenue in revenue_by_category]
            logger.info(f"Revenue by category computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing revenue by category: {str(e)}")
            raise

    @staticmethod
    def get_conversion_rates():
        """Returns conversion metrics for user engagement and sales funnel."""
        try:
            total_users = db.session.query(db.func.count(User.id)).scalar() or 1  # Avoid division by zero
            total_orders = db.session.query(db.func.count(Order.id)).scalar() or 0
            total_product_views = db.session.query(db.func.sum(Product.views)).scalar() or 1  # Avoid division by zero
            total_cart_adds = db.session.query(db.func.sum(Product.cart_adds)).scalar() or 1  # Avoid division by zero
            
            overall_conversion = (total_orders / total_users) * 100 if total_users > 0 else 0
            product_conversion = (total_orders / total_product_views) * 100 if total_product_views > 0 else 0
            cart_conversion = (total_orders / total_cart_adds) * 100 if total_cart_adds > 0 else 0
            
            result = {
                "overall_conversion_rate": round(overall_conversion, 2),
                "product_conversion_rate": round(product_conversion, 2),
                "cart_conversion_rate": round(cart_conversion, 2)
            }
            logger.info(f"Conversion rates computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing conversion rates: {str(e)}")
            raise

    @staticmethod
    def get_analytics_overview():
        """Returns a summary of total sales, orders, and users."""
        try:
            total_revenue = db.session.query(db.func.sum(Order.total))\
                .filter(Order.payment_status == PaymentStatus.COMPLETED.value).scalar() or 0.0
            total_orders = db.session.query(db.func.count(Order.id)).scalar() or 0
            total_users = db.session.query(db.func.count(User.id)).scalar() or 0
            
            result = {
                "total_revenue": float(total_revenue),
                "total_orders": total_orders,
                "total_users": total_users
            }
            logger.info(f"Analytics overview computed: {result}")
            return result
        except Exception as e:
            logger.error(f"Error computing analytics overview: {str(e)}")
            raise