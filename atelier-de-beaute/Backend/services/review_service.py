from models.review import Review
from models.product import Product
from models.user import User, UserRole
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from extensions import db
import logging

logger = logging.getLogger(__name__)

class ReviewService:
    @staticmethod
    def create_review(data, user_id, user_role):
        if user_role != UserRole.CUSTOMER:
            logger.error(f"User ID {user_id} with role {user_role} cannot create reviews")
            raise ValueError("Only customers can create reviews")
        
        # Cast user_id to integer
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            logger.error(f"Invalid user_id type: {type(user_id)}, value: {user_id}")
            raise ValueError("Invalid user ID")
        
        # Validate product_id
        product_id = data.get('product_id')
        if not product_id:
            logger.error("Missing product_id in review data")
            raise ValueError("Product ID is required")
        
        product = Product.query.get(product_id)
        if not product:
            logger.error(f"Product ID {product_id} not found")
            raise ValueError("Product not found")
        
        # Check for existing review
        existing_review = Review.query.filter_by(product_id=product_id, user_id=user_id).first()
        if existing_review:
            logger.error(f"User ID {user_id} already reviewed product ID {product_id}")
            raise ValueError("You have already reviewed this product")
        
        # Validate rating
        rating = data.get('rating')
        if rating is None:
            logger.error("Missing rating in review data")
            raise ValueError("Rating is required")
        if not isinstance(rating, int):
            logger.error(f"Invalid rating type: {type(rating)}, value: {rating}")
            raise ValueError("Rating must be an integer")
        if not 1 <= rating <= 5:
            logger.error(f"Invalid rating value: {rating}")
            raise ValueError("Rating must be between 1 and 5")
        
        # Validate comment
        comment = data.get('comment')
        if comment is not None and not isinstance(comment, str):
            logger.error(f"Invalid comment type: {type(comment)}, value: {comment}")
            raise ValueError("Comment must be a string")
        
        # Create review
        review = Review(
            product_id=product_id,
            user_id=user_id,
            rating=rating,
            comment=comment,
            is_featured=False
        )
        
        try:
            db.session.add(review)
            db.session.commit()
            logger.info(f"Review created for product ID {product_id} by user ID {user_id}")
        except Exception as e:
            logger.error(f"Database error creating review for product ID {product_id}: {str(e)}")
            db.session.rollback()
            raise ValueError("Failed to create review due to database error")
        
        return review
    @staticmethod
    def get_review(review_id, eager_load=False):
        query = Review.query.filter_by(id=review_id)
        if eager_load:
            query = query.join(Product).join(User)
        return query.first()

    @staticmethod
    def update_review(review_id, data, user_id, user_role):
        logger.info(f"Updating review ID {review_id} for user ID {user_id}, role: {user_role}, data: {data}")
        review = Review.query.get(review_id)
        if not review:
            logger.error(f"Review ID {review_id} not found")
            raise ValueError("Review not found")
        
        # Ensure user_id is integer
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            logger.error(f"Invalid user_id type: {type(user_id)}, value: {user_id}")
            raise ValueError("Invalid user ID")
        
        # Log types and values for debugging
        logger.debug(f"Comparing user_id: {user_id} (type: {type(user_id)}), review.user_id: {review.user_id} (type: {type(review.user_id)})")
        
        if user_role not in [UserRole.ADMIN, UserRole.MANAGER] and review.user_id != user_id:
            logger.error(f"User ID {user_id} unauthorized to update review ID {review_id} (owner: {review.user_id})")
            raise PermissionError("Unauthorized to update this review")
        
        # Validate rating
        if 'rating' in data:
            rating = data['rating']
            if not isinstance(rating, int):
                logger.error(f"Invalid rating type for review ID {review_id}: {type(rating)}")
                raise ValueError("Rating must be an integer")
            if not 1 <= rating <= 5:
                logger.error(f"Invalid rating value for review ID {review_id}: {rating}")
                raise ValueError("Invalid rating: must be between 1 and 5")
            review.rating = rating
        
        # Validate comment
        if 'comment' in data:
            comment = data['comment']
            if not isinstance(comment, str):
                logger.error(f"Invalid comment type for review ID {review_id}: {type(comment)}")
                raise ValueError("Comment must be a string")
            review.comment = comment
        
        try:
            db.session.commit()
            logger.info(f"Review ID {review_id} updated successfully")
        except Exception as e:
            logger.error(f"Database error updating review ID {review_id}: {str(e)}")
            db.session.rollback()
            raise ValueError("Failed to update review due to database error")
        
        return review
    @staticmethod
    def delete_review(review_id, user_id, user_role):
        logger.info(f"Deleting review ID {review_id} for user ID {user_id}, role: {user_role}")
        review = Review.query.get(review_id)
        if not review:
            logger.error(f"Review ID {review_id} not found")
            raise ValueError("Review not found")
        
        # Ensure user_id is integer
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            logger.error(f"Invalid user_id type: {type(user_id)}, value: {user_id}")
            raise ValueError("Invalid user ID")
        
        # Log types and values
        logger.debug(f"Comparing user_id: {user_id} (type: {type(user_id)}), review.user_id: {review.user_id} (type: {type(review.user_id)})")
        
        if user_role not in [UserRole.ADMIN, UserRole.MANAGER] and review.user_id != user_id:
            logger.error(f"User ID {user_id} unauthorized to delete review ID {review_id} (owner: {review.user_id})")
            raise PermissionError("Unauthorized to delete this review")
        
        try:
            db.session.delete(review)
            db.session.commit()
            logger.info(f"Review ID {review_id} deleted successfully")
        except Exception as e:
            logger.error(f"Database error deleting review ID {review_id}: {str(e)}")
            db.session.rollback()
            raise ValueError("Failed to delete review due to database error")

    @staticmethod
    def get_reviews(product_id=None, eager_load=False):
        query = Review.query
        if product_id:
            query = query.filter_by(product_id=product_id)
        if eager_load:
            query = query.join(Product).join(User)
        return query.all()

    @staticmethod
    def get_featured_reviews(product_id=None, eager_load=False):
        query = Review.query.filter_by(is_featured=True)
        if product_id:
            query = query.filter_by(product_id=product_id)
        if eager_load:
            query = query.join(Product).join(User)
        return query.all()

    @staticmethod
    def toggle_featured(review_id, user_id, user_role):
        if user_role not in [UserRole.ADMIN, UserRole.MANAGER]:
            raise ValueError("Only admins or managers can toggle featured status")
        
        review = Review.query.get(review_id)
        if not review:
            raise ValueError("Review not found")
        
        review.is_featured = not review.is_featured
        db.session.commit()
        return review

    @staticmethod
    def get_review_analytics():
        result = db.session.query(
            Product.name,
            Product.category,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).join(Review).group_by(Product.id, Product.name, Product.category).all()
        
        return [{
            'product': r.name,
            'category': r.category,
            'avg_rating': float(r.avg_rating) if r.avg_rating else 0.0,
            'review_count': r.review_count
        } for r in result]