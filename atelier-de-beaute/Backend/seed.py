import logging
from extensions import db
from app import create_app
from models.category import Category
from models.product import Product

app = create_app()

# Setting up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def seed_data():
    logger.info("Starting to seed data...")

    try:
        # Clear existing data
        logger.info("Deleting existing data from Product and Category tables...")
        Product.query.delete()
        Category.query.delete()
        db.session.commit()
        logger.info("Existing data deleted successfully.")
    except Exception as e:
        logger.error(f"Error deleting existing data: {e}")
        db.session.rollback()
        raise

    # Initialize variables to store category instances
    brands = makeup = loreal = maybelline = lip_products = face_products = None
    loreal_lip = loreal_face = maybelline_lip = maybelline_face = None

    try:
        # 1. Top-level categories
        logger.info("Seeding top-level categories...")
        brands = Category(
            name="Brands",
            description="Shop products by your favorite brands",
            image_urls=["https://images.unsplash.com/photo-1596462502278-27bfdc403348"],
            is_featured=True,
            display_order=1
        )
        brands.generate_slug()
        db.session.add(brands)

        makeup = Category(
            name="Makeup",
            description="Explore makeup products",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_featured=True,
            display_order=2
        )
        makeup.generate_slug()
        db.session.add(makeup)
        
        db.session.commit()
        logger.info("Top-level categories added successfully.")
    except Exception as e:
        logger.error(f"Error adding top-level categories: {e}")
        db.session.rollback()
        raise

    try:
        # 2. Second-level categories (under Brands)
        logger.info("Seeding second-level categories under Brands...")
        loreal = Category(
            name="L’Oréal",
            description="L’Oréal Paris products",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            parent_id=brands.id,
            display_order=1
        )
        loreal.generate_slug()
        db.session.add(loreal)

        maybelline = Category(
            name="Maybelline",
            description="Maybelline New York products",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            parent_id=brands.id,
            display_order=2
        )
        maybelline.generate_slug()
        db.session.add(maybelline)
        
        db.session.commit()
        logger.info("Second-level categories under Brands added successfully.")
    except Exception as e:
        logger.error(f"Error adding second-level categories under Brands: {e}")
        db.session.rollback()
        raise

    try:
        # Second-level categories (under Makeup)
        logger.info("Seeding second-level categories under Makeup...")
        lip_products = Category(
            name="Lip Products",
            description="Lipsticks and lip glosses",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            parent_id=makeup.id,
            display_order=1
        )
        lip_products.generate_slug()
        db.session.add(lip_products)

        face_products = Category(
            name="Face Products",
            description="Foundations and concealers",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            parent_id=makeup.id,
            display_order=2
        )
        face_products.generate_slug()
        db.session.add(face_products)

        db.session.commit()
        logger.info("Second-level categories under Makeup added successfully.")
    except Exception as e:
        logger.error(f"Error adding second-level categories under Makeup: {e}")
        db.session.rollback()
        raise

    try:
        # 3. Third-level categories
        logger.info("Seeding third-level categories...")
        loreal_lip = Category(
            name="L’Oréal Lip",
            description="L’Oréal lip products",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            parent_id=loreal.id,
            display_order=1
        )
        loreal_lip.generate_slug()
        db.session.add(loreal_lip)

        loreal_face = Category(
            name="L’Oréal Face",
            description="L’Oréal face products",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            parent_id=loreal.id,
            display_order=2
        )
        loreal_face.generate_slug()
        db.session.add(loreal_face)

        maybelline_lip = Category(
            name="Maybelline Lip",
            description="Maybelline lip products",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            parent_id=maybelline.id,
            display_order=1
        )
        maybelline_lip.generate_slug()
        db.session.add(maybelline_lip)

        maybelline_face = Category(
            name="Maybelline Face",
            description="Maybelline face products",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            parent_id=maybelline.id,
            display_order=2
        )
        maybelline_face.generate_slug()
        db.session.add(maybelline_face)

        db.session.commit()
        logger.info("Third-level categories added successfully.")
    except Exception as e:
        logger.error(f"Error adding third-level categories: {e}")
        db.session.rollback()
        raise

    try:
        # 4. Products
        logger.info("Seeding products...")
        loreal_lipstick = Product(
            name="L’Oréal Matte Lipstick",
            description="Long-lasting matte lipstick by L’Oréal",
            price=15.99,
            discount_price=12.99,
            stock_quantity=50,
            sku="LOREAL-LIP-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            is_active=True,
            is_featured=True
        )
        loreal_lipstick.generate_slug()
        loreal_lipstick.categories.extend([loreal, loreal_lip, lip_products])
        db.session.add(loreal_lipstick)

        maybelline_foundation = Product(
            name="Maybelline Fit Me Foundation",
            description="Natural finish foundation by Maybelline",
            price=12.99,
            stock_quantity=30,
            sku="MAYBELLINE-FND-001",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        maybelline_foundation.generate_slug()
        maybelline_foundation.categories.extend([maybelline, maybelline_face, face_products])
        db.session.add(maybelline_foundation)

        loreal_mascara = Product(
            name="L’Oréal Voluminous Mascara",
            description="Volumizing mascara by L’Oréal",
            price=10.99,
            stock_quantity=40,
            sku="LOREAL-MSC-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        loreal_mascara.generate_slug()
        loreal_mascara.categories.extend([loreal, loreal_face])
        db.session.add(loreal_mascara)

        db.session.commit()
        logger.info("Products added successfully.")
    except Exception as e:
        logger.error(f"Error adding products: {e}")
        db.session.rollback()
        raise

    logger.info("Atelier-de-Beauty database seeded successfully with three-level category hierarchy!")

if __name__ == "__main__":
    with app.app_context():
        try:
            seed_data()
        except Exception as e:
            logger.error(f"Seeding failed: {e}")
            raise
