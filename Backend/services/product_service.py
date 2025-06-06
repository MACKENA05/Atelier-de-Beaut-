from app import db
from models.product import Product
from models.product import product_category
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from psycopg2.errors import UniqueViolation
import logging

# Configure logging
logger = logging.getLogger(__name__)

from app import db
from models.product import Product
from models.product import product_category
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from psycopg2.errors import UniqueViolation
import logging

# Configure logging
logger = logging.getLogger(__name__)

class ProductService:
    @staticmethod
    def get_descendant_category_ids(category_id):
        from models.category import Category
        category_ids = set()
        def recurse(cat_id):
            category_ids.add(cat_id)
            subcats = Category.query.filter_by(parent_id=cat_id).all()
            for subcat in subcats:
                recurse(subcat.id)
        recurse(category_id)
        return list(category_ids)

    @staticmethod
    def get_all_products(page, per_page, is_featured=None, min_price=None, max_price=None, price_order=None, search_term=None):
        logger.debug(f"Fetching products: page={page}, per_page={per_page}, is_featured={is_featured}, min_price={min_price}, max_price={max_price}, price_order={price_order}, search_term={search_term}")
        try:
            query = Product.query.options(joinedload(Product.categories)).filter_by(is_active=True)

            if is_featured is not None:
                query = query.filter_by(is_featured=is_featured)
            if min_price is not None:
                query = query.filter(Product.price >= min_price)
            if max_price is not None:
                query = query.filter(Product.price <= max_price)
            if search_term:
                search_pattern = f"%{search_term}%"
                query = query.filter(or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern),
                    Product.brand.ilike(search_pattern),
                    Product.sku.ilike(search_pattern)
                ))
            if price_order == 'low':
                query = query.order_by(Product.price.asc())
            elif price_order == 'high':
                query = query.order_by(Product.price.desc())

            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            logger.info(f"Retrieved {paginated.total} products, page {page}/{paginated.pages}")
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except Exception as e:
            logger.error(f"Error in get_all_products: {str(e)}")
            raise


    @staticmethod
    def get_product_by_id(product_id):
        logger.debug(f"Fetching product by ID: {product_id}")
        try:
            product = Product.query.options(joinedload(Product.categories)).filter_by(id=product_id, is_active=True).first()
            if not product:
                logger.warning(f"Product not found: ID={product_id}")
                raise ValueError("Product not found")
            logger.info(f"Retrieved product: ID={product_id}, slug={product.slug}")
            return product
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_product_by_id: {str(e)}")
            raise Exception("Database error occurred")

    @staticmethod
    def get_product_by_slug(slug):
        logger.debug(f"Fetching product by slug: {slug}")
        try:
            product = Product.query.options(joinedload(Product.categories)).filter_by(slug=slug, is_active=True).first()
            if not product:
                logger.warning(f"Product not found: slug={slug}")
                raise ValueError(f"Product with slug '{slug}' not found")
            logger.info(f"Retrieved product: slug={slug}, ID={product.id}")
            return product
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_product_by_slug: {str(e)}")
            raise Exception("Database error occurred")

    @staticmethod
    def get_products_by_category(category_id, page, per_page, price_order=None, search_term=None):
        logger.debug(f"Fetching products by category: category_id={category_id}, page={page}, per_page={per_page}, price_order={price_order}, search_term={search_term}")
        try:
            query = Product.query.options(joinedload(Product.categories)).join(product_category).filter(
                product_category.c.category_id == category_id
            ).filter(Product.is_active == True)
    
            if search_term:
                search_pattern = f"%{search_term}%"
                query = query.filter(or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern),
                    Product.brand.ilike(search_pattern),
                    Product.sku.ilike(search_pattern)
                ))
    
            if price_order == 'low':
                query = query.order_by(Product.price.asc())
            elif price_order == 'high':
                query = query.order_by(Product.price.desc())
    
            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            logger.info(f"Retrieved {paginated.total} products for category ID={category_id}, page {page}/{paginated.pages}")
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except Exception as e:
            logger.error(f"Error in get_products_by_category: {str(e)}")
            raise
        
    @staticmethod
    def get_featured_products(page, per_page):
        logger.debug(f"Fetching featured products: page={page}, per_page={per_page}")
        try:
            query = Product.query.options(joinedload(Product.categories)).filter_by(is_active=True, is_featured=True)
            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            logger.info(f"Retrieved {paginated.total} featured products, page {page}/{paginated.pages}")
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_featured_products: {str(e)}")
            raise Exception("Database error occurred")

    @staticmethod
    def get_deals(page, per_page):
        logger.debug(f"Fetching deals: page={page}, per_page={per_page}")
        try:
            query = Product.query.options(joinedload(Product.categories)).filter(
                Product.is_active == True,
                Product.discount_price.isnot(None)
            )
            page = max(1, page)
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            logger.info(f"Retrieved {paginated.total} deals, page {page}/{paginated.pages}")
            return {
                'items': paginated.items,
                'total': paginated.total,
                'pages': paginated.pages,
                'current_page': page,
                'per_page': per_page
            }
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_deals: {str(e)}")
            raise Exception("Database error occurred")

    @staticmethod
    def create_product(data):
        logger.debug(f"Creating product: {data}")
        try:
            # Exclude category_ids from Product constructor
            product_data = {k: v for k, v in data.items() if k != 'category_ids'}
            product = Product(
                name=product_data.get('name'),
                description=product_data.get('description'),
                price=product_data.get('price'),
                discount_price=product_data.get('discount_price'),
                stock_quantity=product_data.get('stock_quantity', 0),
                sku=product_data.get('sku'),
                brand=product_data.get('brand'),
                image_urls=product_data.get('image_urls', []),
                is_active=product_data.get('is_active', True),
                is_featured=product_data.get('is_featured', False)
            )
            product.generate_slug()
    
            # Handle category assignments
            category_ids = data.get('category_ids', [])
            if category_ids:
                from models.category import Category
                categories = Category.query.filter(Category.id.in_(category_ids)).all()
                if len(categories) != len(category_ids):
                    logger.warning(f"Invalid category IDs: {category_ids}")
                    raise ValueError("One or more category IDs are invalid")
                product.categories.extend(categories)
                logger.debug(f"Assigned categories: {[c.id for c in categories]}")
    
            db.session.add(product)
            db.session.commit()
            logger.info(f"Created product: slug={product.slug}, SKU={product.sku}")
            return product
        except IntegrityError as e:
            db.session.rollback()
            if isinstance(e.orig, UniqueViolation) and 'products_sku_key' in str(e.orig):
                logger.warning(f"Duplicate SKU: {data.get('sku')}")
                raise ValueError(f"A product with SKU '{data.get('sku')}' already exists")
            logger.error(f"Database integrity error in create_product: {str(e)}")
            raise Exception("Database error: Unique constraint violation")
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Database error in create_product: {str(e)}")
            raise Exception(f"Database error: {str(e)}")

    @staticmethod
    def update_product_by_slug(slug, data):
        logger.debug(f"Updating product: slug={slug}, data={data}")
        try:
            product = ProductService.get_product_by_slug(slug)
            # Exclude category_ids from direct attribute updates
            for key, value in data.items():
                if key == 'name':
                    product.name = value
                    product.generate_slug()
                elif key == 'category_ids':
                    from models.category import Category
                    categories = Category.query.filter(Category.id.in_(value)).all()
                    if len(categories) != len(value):
                        logger.warning(f"Invalid category IDs: {value}")
                        raise ValueError("One or more category IDs are invalid")
                    product.categories = categories
                    logger.debug(f"Updated categories: {[c.id for c in categories]}")
                elif hasattr(product, key):
                    setattr(product, key, value)
            db.session.commit()
            logger.info(f"Updated product: slug={product.slug}, SKU={product.sku}")
            return product
        except ValueError as e:
            logger.warning(f"Update failed: {str(e)}")
            raise e
        except IntegrityError as e:
            db.session.rollback()
            if isinstance(e.orig, UniqueViolation) and 'products_sku_key' in str(e.orig):
                logger.warning(f"Duplicate SKU: {data.get('sku')}")
                raise ValueError(f"A product with SKU '{data.get('sku')}' already exists")
            logger.error(f"Database integrity error in update_product_by_slug: {str(e)}")
            raise Exception("Database error: Unique constraint violation")
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Database error in update_product_by_slug: {str(e)}")
            raise Exception(f"Database error: {str(e)}")

    @staticmethod
    def delete_product_by_slug(slug):
        logger.debug(f"Deleting product: slug={slug}")
        try:
            product = ProductService.get_product_by_slug(slug)
            product.is_active = False  # Soft delete
            db.session.commit()
            logger.info(f"Soft deleted product: slug={product.slug}, SKU={product.sku}")
            return product
        except ValueError as e:
            logger.warning(f"Delete failed: {str(e)}")
            raise e
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Database error in delete_product_by_slug: {str(e)}")
            raise Exception(f"Database error: {str(e)}")