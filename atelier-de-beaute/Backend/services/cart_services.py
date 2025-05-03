from extensions import db
from models.cart import Cart, CartItem
from models.product import Product
from models.user import User
from sqlalchemy.exc import SQLAlchemyError
import logging
from schemas.cart_schema import CartSchema, CartAddRequestSchema, CartUpdateRequestSchema

logger = logging.getLogger(__name__)

class Cart_Services:
    @staticmethod
    def get_or_create_user_cart(user_id):
        """Get or create a user's cart in the database."""
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            try:
                db.session.commit()
                logger.info(f"Created new cart for user {user_id}")
            except SQLAlchemyError as e:
                db.session.rollback()
                logger.error(f"Error creating cart for user {user_id}: {str(e)}")
                raise
        return cart

    @staticmethod
    def get_cart_data(user_id):
        """Retrieve cart data for authenticated users."""
        if user_id:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                return {'items': [], 'total': 0.0}
            total = sum(
                item.quantity * item.product.current_price
                for item in cart.items
                if item.product.is_active
            )
            cart_data = CartSchema().dump({
                'items': [item for item in cart.items if item.product.is_active],
                'total': float(total)
            })
            return cart_data
        else:
            # Guest cart is handled client-side via local storage
            return {'items': [], 'total': 0.0}

    @staticmethod
    def add_to_cart(user_id, data):
        """Add item to cart for authenticated or guest users and return the item."""
        validated_data = CartAddRequestSchema().load(data)
        product_id = validated_data['product_id']
        quantity = validated_data['quantity']
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")
        if not product.is_active:
            raise ValueError("Product is not available")

        if user_id:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            cart = Cart_Services.get_or_create_user_cart(user_id)
            cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
            current_quantity = cart_item.quantity if cart_item else 0
            if current_quantity + quantity > product.stock_quantity:
                raise ValueError(f"Cannot add {quantity} more items. Only {product.stock_quantity - current_quantity} available")
            if cart_item:
                cart_item.quantity += quantity
            else:
                cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
                db.session.add(cart_item)
            try:
                db.session.commit()
                logger.info(f"Added {quantity} of product {product_id} to cart for user {user_id}")
                return cart_item
            except SQLAlchemyError as e:
                db.session.rollback()
                logger.error(f"Error adding product {product_id} to cart for user {user_id}: {str(e)}")
                raise
        else:
            # Guest cart: return pseudo-item for client-side local storage
            return {
                'id': f"guest_{product_id}",
                'product_id': product_id,
                'quantity': quantity,
                'cart_id': None
            }

    @staticmethod
    def update_cart_item(user_id, data):
        """Update item quantity in cart for authenticated users."""
        validated_data = CartUpdateRequestSchema().load(data)
        product_id = validated_data['product_id']
        quantity = validated_data['quantity']
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")
        if not product.is_active:
            raise ValueError("Product is not available")
        if quantity > product.stock_quantity:
            raise ValueError(f"Requested quantity {quantity} exceeds available stock {product.stock_quantity}")

        if user_id:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                raise ValueError("Cart not found")
            cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
            if not cart_item:
                raise ValueError("Item not found in cart")
            cart_item.quantity = quantity
            try:
                db.session.commit()
                logger.info(f"Updated product {product_id} to quantity {quantity} for user {user_id}")
                return cart_item
            except SQLAlchemyError as e:
                db.session.rollback()
                logger.error(f"Error updating product {product_id} for user {user_id}: {str(e)}")
                raise
        else:
            # Guest cart: return pseudo-item for client-side local storage
            return {
                'id': f"guest_{product_id}",
                'product_id': product_id,
                'quantity': quantity,
                'cart_id': None
            }

    @staticmethod
    def remove_from_cart(user_id, product_id):
        """Remove item from cart for authenticated users."""
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found")

        if user_id:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                raise ValueError("Cart not found")
            cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
            if not cart_item:
                raise ValueError("Item not found in cart")
            db.session.delete(cart_item)
            try:
                db.session.commit()
                logger.info(f"Removed product {product_id} from cart for user {user_id}")
            except SQLAlchemyError as e:
                db.session.rollback()
                logger.error(f"Error removing product {product_id} from cart for user {user_id}: {str(e)}")
                raise
        else:
            # Guest cart is managed client-side
            pass

    @staticmethod
    def merge_guest_cart(user_id, guest_cart):
        """Merge guest cart (from local storage) with authenticated user's cart."""
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")
        cart = Cart_Services.get_or_create_user_cart(user_id)

        for item in guest_cart.get('items', []):
            try:
                product_id = item['product_id']
                quantity = item['quantity']
                product = Product.query.get(product_id)
                if not product or not product.is_active:
                    logger.warning(f"Skipping product {product_id} during merge: not found or inactive")
                    continue
                cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
                current_quantity = cart_item.quantity if cart_item else 0
                if current_quantity + quantity > product.stock_quantity:
                    logger.warning(f"Skipping product {product_id}: insufficient stock (available: {product.stock_quantity}, requested: {current_quantity + quantity})")
                    continue
                if cart_item:
                    cart_item.quantity += quantity
                else:
                    cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
                    db.session.add(cart_item)
            except (KeyError, TypeError, ValueError) as e:
                logger.warning(f"Invalid item in guest cart during merge: {str(e)}")
                continue
        try:
            db.session.commit()
            logger.info(f"Merged guest cart with user {user_id}'s cart")
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error merging guest cart for user {user_id}: {str(e)}")
            raise

    @staticmethod
    def clear_cart(user_id):
        """Clear all items from the cart."""
        if user_id:
            user = User.query.get(user_id)
            if not user:
                raise ValueError("User not found")
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                return  # No cart exists, nothing to clear
            # Delete all cart items
            CartItem.query.filter_by(cart_id=cart.id).delete()
            try:
                db.session.commit()
                logger.info(f"Cleared cart for user {user_id}")
            except SQLAlchemyError as e:
                db.session.rollback()
                logger.error(f"Error clearing cart for user {user_id}: {str(e)}")
                raise
        else:
            # Guest cart is cleared client-side
            logger.info("Guest cart clear requested; handled client-side")
            pass