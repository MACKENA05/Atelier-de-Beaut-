import logging
from sqlalchemy.sql import text
from sqlalchemy import inspect
from extensions import db
from app import create_app
from models.category import Category
from models.product import Product
from models.user import User, UserRole
from models.cart import Cart, CartItem
from models.order import Order, OrderItem, Address, Invoice, PaymentStatus, DeliveryStatus
from models.review import Review
from werkzeug.security import generate_password_hash
import uuid
from datetime import datetime, timezone

app = create_app()

# Setting up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def seed_data():
    logger.info("Starting to seed data...")

    try:
        # Clear existing data
        logger.info("Clearing existing data from all relevant tables...")
        inspector = inspect(db.engine)
        db.session.execute(text("DELETE FROM reviews"))
        db.session.execute(text("DELETE FROM invoices"))
        db.session.execute(text("DELETE FROM addresses"))
        db.session.execute(text("DELETE FROM order_items"))
        db.session.execute(text("DELETE FROM orders"))
        db.session.execute(text("DELETE FROM product_category"))
        db.session.execute(text("DELETE FROM cart_items"))
        db.session.execute(text("DELETE FROM carts"))
        Product.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()
        logger.info("Existing data deleted successfully.")
    except Exception as e:
        logger.error(f"Error deleting existing data: {e}")
        db.session.rollback()
        raise

    # Initialize variables for categories
    brands = makeup = fragrance = haircare = skincare = accessories = deals = None
    loreal = estee_lauder = chanel = mac = maybelline = fenty = None
    face_makeup = eye_makeup = lip_makeup = None
    foundation = concealer = blush = highlighter = setting_powder = None
    mascara = eyeliner = eyeshadow = brow_products = None
    lipstick = lip_gloss = lip_liner = lip_balm = None
    women_fragrance = men_fragrance = unisex_fragrance = None
    floral_w = fruity_w = woody_w = oriental_w = None
    fresh_m = woody_m = spicy_m = citrus_m = None
    fresh_u = citrus_u = floral_u = None
    shampoos = conditioners = hair_treatments = hair_styling = None
    dry_hair = oily_hair = curly_hair = color_treated = None
    hydrating_cond = volumizing_cond = repairing_cond = None
    hair_masks = serums = oils = None
    hair_gel = hair_mousse = hair_spray = hair_cream = None
    cleansers = moisturizers = serums_skincare = masks = sunscreen = None
    foaming_cleanser = cream_cleanser = gel_cleanser = None
    day_cream = night_cream = gel_moisturizer = None
    vit_c_serum = hyaluronic_serum = retinol_serum = None
    sheet_masks = clay_masks = peel_off_masks = None
    spf_30 = spf_50 = None
    jewelry = bags = beauty_tools = None
    necklaces = earrings = bracelets = rings = None
    handbags = wallets = crossbody_bags = None
    makeup_brushes = hair_dryers = straighteners = curling_irons = None
    discounted_items = clearance_items = None

    try:
        # 1. Top-level categories
        logger.info("Seeding top-level categories...")
        brands = Category(name="Brands", description="Shop by favorite brands", image_urls=["https://images.unsplash.com/photo-1596462502278-27bfdc403348"], is_featured=True, display_order=1)
        brands.generate_slug()
        db.session.add(brands)

        makeup = Category(name="Makeup", description="Explore makeup products", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], is_featured=True, display_order=2)
        makeup.generate_slug()
        db.session.add(makeup)

        fragrance = Category(name="Fragrance", description="Discover perfumes and colognes", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], is_featured=True, display_order=3)
        fragrance.generate_slug()
        db.session.add(fragrance)

        haircare = Category(name="Haircare", description="Shampoos, conditioners, and styling products", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], is_featured=True, display_order=4)
        haircare.generate_slug()
        db.session.add(haircare)

        skincare = Category(name="Skincare", description="Cleansers, moisturizers, and more", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], is_featured=True, display_order=5)
        skincare.generate_slug()
        db.session.add(skincare)

        accessories = Category(name="Accessories", description="Jewelry, bags, and beauty tools", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], is_featured=True, display_order=6)
        accessories.generate_slug()
        db.session.add(accessories)

        deals = Category(name="Deals", description="Special offers and clearance items", image_urls=["https://images.unsplash.com/photo-1560243563-0627d31c8217"], is_featured=True, display_order=7)
        deals.generate_slug()
        db.session.add(deals)

        db.session.commit()
        logger.info("Top-level categories added successfully.")
    except Exception as e:
        logger.error(f"Error adding top-level categories: {e}")
        db.session.rollback()
        raise

    try:
        # 2. Second-level categories
        logger.info("Seeding second-level categories...")

        # Brands
        loreal = Category(name="L’Oréal", description="L’Oréal Paris products", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=1)
        loreal.generate_slug()
        db.session.add(loreal)

        estee_lauder = Category(name="Estée Lauder", description="Estée Lauder luxury products", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=2)
        estee_lauder.generate_slug()
        db.session.add(estee_lauder)

        chanel = Category(name="Chanel", description="Chanel beauty products", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=3)
        chanel.generate_slug()
        db.session.add(chanel)

        mac = Category(name="MAC Cosmetics", description="MAC professional makeup", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=4)
        mac.generate_slug()
        db.session.add(mac)

        maybelline = Category(name="Maybelline", description="Maybelline New York products", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=5)
        maybelline.generate_slug()
        db.session.add(maybelline)

        fenty = Category(name="Fenty Beauty", description="Fenty Beauty by Rihanna", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=brands.id, display_order=6)
        fenty.generate_slug()
        db.session.add(fenty)

        # Makeup
        face_makeup = Category(name="Face Makeup", description="Foundation, concealer, and more", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=makeup.id, display_order=1)
        face_makeup.generate_slug()
        db.session.add(face_makeup)

        eye_makeup = Category(name="Eye Makeup", description="Mascara, eyeliner, and eyeshadow", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=makeup.id, display_order=2)
        eye_makeup.generate_slug()
        db.session.add(eye_makeup)

        lip_makeup = Category(name="Lip Makeup", description="Lipstick, gloss, and liners", image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], parent_id=makeup.id, display_order=3)
        lip_makeup.generate_slug()
        db.session.add(lip_makeup)

        # Fragrance
        women_fragrance = Category(name="Women's Fragrance", description="Perfumes for women", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=fragrance.id, display_order=1)
        women_fragrance.generate_slug()
        db.session.add(women_fragrance)

        men_fragrance = Category(name="Men's Fragrance", description="Colognes for men", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=fragrance.id, display_order=2)
        men_fragrance.generate_slug()
        db.session.add(men_fragrance)

        unisex_fragrance = Category(name="Unisex Fragrance", description="Fragrances for all", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=fragrance.id, display_order=3)
        unisex_fragrance.generate_slug()
        db.session.add(unisex_fragrance)

        # Haircare
        shampoos = Category(name="Shampoos", description="Cleansing for all hair types", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=haircare.id, display_order=1)
        shampoos.generate_slug()
        db.session.add(shampoos)

        conditioners = Category(name="Conditioners", description="Nourishing conditioners", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=haircare.id, display_order=2)
        conditioners.generate_slug()
        db.session.add(conditioners)

        hair_treatments = Category(name="Hair Treatments", description="Masks, serums, and oils", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=haircare.id, display_order=3)
        hair_treatments.generate_slug()
        db.session.add(hair_treatments)

        hair_styling = Category(name="Hair Styling", description="Gels, mousses, and sprays", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=haircare.id, display_order=4)
        hair_styling.generate_slug()
        db.session.add(hair_styling)

        # Skincare
        cleansers = Category(name="Cleansers", description="Foaming, cream, and gel cleansers", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=skincare.id, display_order=1)
        cleansers.generate_slug()
        db.session.add(cleansers)

        moisturizers = Category(name="Moisturizers", description="Day, night, and gel moisturizers", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=skincare.id, display_order=2)
        moisturizers.generate_slug()
        db.session.add(moisturizers)

        serums_skincare = Category(name="Serums", description="Targeted skincare serums", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=skincare.id, display_order=3)
        serums_skincare.generate_slug()
        db.session.add(serums_skincare)

        masks = Category(name="Masks", description="Sheet, clay, and peel-off masks", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=skincare.id, display_order=4)
        masks.generate_slug()
        db.session.add(masks)

        sunscreen = Category(name="Sunscreen", description="SPF protection", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=skincare.id, display_order=5)
        sunscreen.generate_slug()
        db.session.add(sunscreen)

        # Accessories
        jewelry = Category(name="Jewelry", description="Necklaces, earrings, and more", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=accessories.id, display_order=1)
        jewelry.generate_slug()
        db.session.add(jewelry)

        bags = Category(name="Bags", description="Handbags, wallets, and crossbody bags", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=accessories.id, display_order=2)
        bags.generate_slug()
        db.session.add(bags)

        beauty_tools = Category(name="Beauty Tools", description="Brushes, dryers, and more", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=accessories.id, display_order=3)
        beauty_tools.generate_slug()
        db.session.add(beauty_tools)

        # Deals
        discounted_items = Category(name="Discounted Items", description="Special discounts", image_urls=["https://images.unsplash.com/photo-1560243563-0627d31c8217"], parent_id=deals.id, display_order=1)
        discounted_items.generate_slug()
        db.session.add(discounted_items)

        clearance_items = Category(name="Clearance Items", description="Clearance products", image_urls=["https://images.unsplash.com/photo-1560243563-0627d31c8217"], parent_id=deals.id, display_order=2)
        clearance_items.generate_slug()
        db.session.add(clearance_items)

        db.session.commit()
        logger.info("Second-level categories added successfully.")
    except Exception as e:
        logger.error(f"Error adding second-level categories: {e}")
        db.session.rollback()
        raise

    try:
        # 3. Third-level categories
        logger.info("Seeding third-level categories...")

        # Makeup -> Face Makeup
        foundation = Category(name="Foundation", description="Liquid and powder foundations", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=face_makeup.id, display_order=1)
        foundation.generate_slug()
        db.session.add(foundation)

        concealer = Category(name="Concealer", description="Concealers for all skin types", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=face_makeup.id, display_order=2)
        concealer.generate_slug()
        db.session.add(concealer)

        blush = Category(name="Blush", description="Powder and cream blushes", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=face_makeup.id, display_order=3)
        blush.generate_slug()
        db.session.add(blush)

        highlighter = Category(name="Highlighter", description="Glow-enhancing highlighters", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=face_makeup.id, display_order=4)
        highlighter.generate_slug()
        db.session.add(highlighter)

        setting_powder = Category(name="Setting Powder", description="Matte and translucent powders", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=face_makeup.id, display_order=5)
        setting_powder.generate_slug()
        db.session.add(setting_powder)

        # Makeup -> Eye Makeup
        mascara = Category(name="Mascara", description="Volumizing and lengthening mascaras", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=eye_makeup.id, display_order=1)
        mascara.generate_slug()
        db.session.add(mascara)

        eyeliner = Category(name="Eyeliner", description="Liquid and pencil eyeliners", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=eye_makeup.id, display_order=2)
        eyeliner.generate_slug()
        db.session.add(eyeliner)

        eyeshadow = Category(name="Eyeshadow", description="Palettes and single shadows", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=eye_makeup.id, display_order=3)
        eyeshadow.generate_slug()
        db.session.add(eyeshadow)

        brow_products = Category(name="Brow Products", description="Pencils, gels, and powders", image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"], parent_id=eye_makeup.id, display_order=4)
        brow_products.generate_slug()
        db.session.add(brow_products)

        # Makeup -> Lip Makeup
        lipstick = Category(name="Lipstick", description="Matte, satin, and glossy lipsticks", image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], parent_id=lip_makeup.id, display_order=1)
        lipstick.generate_slug()
        db.session.add(lipstick)

        lip_gloss = Category(name="Lip Gloss", description="Shiny and non-sticky glosses", image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], parent_id=lip_makeup.id, display_order=2)
        lip_gloss.generate_slug()
        db.session.add(lip_gloss)

        lip_liner = Category(name="Lip Liner", description="Precise lip liners", image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], parent_id=lip_makeup.id, display_order=3)
        lip_liner.generate_slug()
        db.session.add(lip_liner)

        lip_balm = Category(name="Lip Balm", description="Hydrating lip balms", image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], parent_id=lip_makeup.id, display_order=4)
        lip_balm.generate_slug()
        db.session.add(lip_balm)

        # Fragrance -> Women's Fragrance
        floral_w = Category(name="Floral", description="Floral women's fragrances", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=women_fragrance.id, display_order=1)
        floral_w.generate_slug()
        db.session.add(floral_w)

        fruity_w = Category(name="Fruity", description="Fruity women's fragrances", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=women_fragrance.id, display_order=2)
        fruity_w.generate_slug()
        db.session.add(fruity_w)

        # Fragrance -> Men's Fragrance
        fresh_m = Category(name="Fresh", description="Fresh men's colognes", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=men_fragrance.id, display_order=1)
        fresh_m.generate_slug()
        db.session.add(fresh_m)

        woody_m = Category(name="Woody", description="Woody men's colognes", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=men_fragrance.id, display_order=2)
        woody_m.generate_slug()
        db.session.add(woody_m)

        # Fragrance -> Unisex Fragrance
        citrus_u = Category(name="Citrus", description="Citrus unisex fragrances", image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"], parent_id=unisex_fragrance.id, display_order=1)
        citrus_u.generate_slug()
        db.session.add(citrus_u)

        # Haircare -> Shampoos
        dry_hair = Category(name="For Dry Hair", description="Shampoos for dry hair", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=shampoos.id, display_order=1)
        dry_hair.generate_slug()
        db.session.add(dry_hair)

        curly_hair = Category(name="For Curly Hair", description="Shampoos for curly hair", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=shampoos.id, display_order=2)
        curly_hair.generate_slug()
        db.session.add(curly_hair)

        # Haircare -> Conditioners
        hydrating_cond = Category(name="Hydrating Conditioner", description="Moisturizing conditioners", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=conditioners.id, display_order=1)
        hydrating_cond.generate_slug()
        db.session.add(hydrating_cond)

        # Haircare -> Hair Treatments
        hair_masks = Category(name="Hair Masks", description="Deep conditioning masks", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=hair_treatments.id, display_order=1)
        hair_masks.generate_slug()
        db.session.add(hair_masks)

        oils = Category(name="Oils", description="Nourishing hair oils", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=hair_treatments.id, display_order=2)
        oils.generate_slug()
        db.session.add(oils)

        # Haircare -> Hair Styling
        hair_spray = Category(name="Hair Spray", description="Hold and shine sprays", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], parent_id=hair_styling.id, display_order=1)
        hair_spray.generate_slug()
        db.session.add(hair_spray)

        # Skincare -> Cleansers
        gel_cleanser = Category(name="Gel Cleanser", description="Refreshing gel cleansers", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=cleansers.id, display_order=1)
        gel_cleanser.generate_slug()
        db.session.add(gel_cleanser)

        # Skincare -> Moisturizers
        day_cream = Category(name="Day Cream", description="Daytime moisturizers", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=moisturizers.id, display_order=1)
        day_cream.generate_slug()
        db.session.add(day_cream)

        night_cream = Category(name="Night Cream", description="Overnight moisturizers", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=moisturizers.id, display_order=2)
        night_cream.generate_slug()
        db.session.add(night_cream)

        # Skincare -> Serums
        hyaluronic_serum = Category(name="Hyaluronic Acid Serum", description="Hydrating serums", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=serums_skincare.id, display_order=1)
        hyaluronic_serum.generate_slug()
        db.session.add(hyaluronic_serum)

        # Skincare -> Masks
        sheet_masks = Category(name="Sheet Masks", description="Hydrating sheet masks", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=masks.id, display_order=1)
        sheet_masks.generate_slug()
        db.session.add(sheet_masks)

        clay_masks = Category(name="Clay Masks", description="Purifying clay masks", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=masks.id, display_order=2)
        clay_masks.generate_slug()
        db.session.add(clay_masks)

        # Skincare -> Sunscreen
        spf_50 = Category(name="SPF 50", description="High SPF protection", image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"], parent_id=sunscreen.id, display_order=1)
        spf_50.generate_slug()
        db.session.add(spf_50)

        # Accessories -> Jewelry
        necklaces = Category(name="Necklaces", description="Stylish necklaces", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=jewelry.id, display_order=1)
        necklaces.generate_slug()
        db.session.add(necklaces)

        earrings = Category(name="Earrings", description="Elegant earrings", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=jewelry.id, display_order=2)
        earrings.generate_slug()
        db.session.add(earrings)

        # Accessories -> Bags
        handbags = Category(name="Handbags", description="Fashionable handbags", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=bags.id, display_order=1)
        handbags.generate_slug()
        db.session.add(handbags)

        crossbody_bags = Category(name="Crossbody Bags", description="Chic crossbody bags", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=bags.id, display_order=2)
        crossbody_bags.generate_slug()
        db.session.add(crossbody_bags)

        # Accessories -> Beauty Tools
        makeup_brushes = Category(name="Makeup Brushes", description="Professional makeup brushes", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=beauty_tools.id, display_order=1)
        makeup_brushes.generate_slug()
        db.session.add(makeup_brushes)

        hair_dryers = Category(name="Hair Dryers", description="High-performance hair dryers", image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"], parent_id=beauty_tools.id, display_order=2)
        hair_dryers.generate_slug()
        db.session.add(hair_dryers)

        db.session.commit()
        logger.info("Third-level categories added successfully.")
    except Exception as e:
        logger.error(f"Error adding third-level categories: {e}")
        db.session.rollback()
        raise

    try:
        # 4. Products
        logger.info("Seeding products...")

        # Original Products
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
        loreal_lipstick.categories.extend([loreal, lip_makeup, lipstick, discounted_items])
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
        maybelline_foundation.categories.extend([maybelline, face_makeup, foundation])
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
        loreal_mascara.categories.extend([loreal, eye_makeup, mascara])
        db.session.add(loreal_mascara)

        fenty_highlighter = Product(
            name="Fenty Killawatt Highlighter",
            description="Radiant highlighter by Fenty Beauty",
            price=36.00,
            stock_quantity=25,
            sku="FENTY-HLT-001",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True,
            is_featured=True
        )
        fenty_highlighter.generate_slug()
        fenty_highlighter.categories.extend([fenty, face_makeup, highlighter])
        db.session.add(fenty_highlighter)

        mac_eyeshadow = Product(
            name="MAC Eyeshadow Palette",
            description="Vibrant eyeshadow palette by MAC",
            price=45.00,
            stock_quantity=20,
            sku="MAC-EYE-001",
            brand="MAC Cosmetics",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        mac_eyeshadow.generate_slug()
        mac_eyeshadow.categories.extend([mac, eye_makeup, eyeshadow])
        db.session.add(mac_eyeshadow)

        chanel_lip_gloss = Product(
            name="Chanel Rouge Coco Gloss",
            description="Hydrating lip gloss by Chanel",
            price=38.00,
            discount_price=30.00,
            stock_quantity=15,
            sku="CHANEL-GLS-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            is_active=True,
            is_featured=True
        )
        chanel_lip_gloss.generate_slug()
        chanel_lip_gloss.categories.extend([chanel, lip_makeup, lip_gloss, discounted_items])
        db.session.add(chanel_lip_gloss)

        estee_lauder_concealer = Product(
            name="Estée Lauder Double Wear Concealer",
            description="Long-wear concealer by Estée Lauder",
            price=29.00,
            stock_quantity=35,
            sku="ESTEE-CON-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        estee_lauder_concealer.generate_slug()
        estee_lauder_concealer.categories.extend([estee_lauder, face_makeup, concealer])
        db.session.add(estee_lauder_concealer)

        chanel_floral_perfume = Product(
            name="Chanel Chance Eau Tendre",
            description="Floral perfume for women by Chanel",
            price=120.00,
            stock_quantity=10,
            sku="CHANEL-PRF-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True,
            is_featured=True
        )
        chanel_floral_perfume.generate_slug()
        chanel_floral_perfume.categories.extend([chanel, women_fragrance, floral_w])
        db.session.add(chanel_floral_perfume)

        loreal_men_cologne = Product(
            name="L’Oréal Men Expert Cologne",
            description="Fresh cologne for men by L’Oréal",
            price=45.00,
            discount_price=35.00,
            stock_quantity=20,
            sku="LOREAL-COL-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True
        )
        loreal_men_cologne.generate_slug()
        loreal_men_cologne.categories.extend([loreal, men_fragrance, fresh_m, clearance_items])
        db.session.add(loreal_men_cologne)

        fenty_unisex_fragrance = Product(
            name="Fenty Eau de Parfum",
            description="Citrus unisex fragrance by Fenty",
            price=135.00,
            stock_quantity=12,
            sku="FENTY-FRG-001",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True
        )
        fenty_unisex_fragrance.generate_slug()
        fenty_unisex_fragrance.categories.extend([fenty, unisex_fragrance, citrus_u])
        db.session.add(fenty_unisex_fragrance)

        loreal_dry_shampoo = Product(
            name="L’Oréal Elvive Dry Shampoo",
            description="Revitalizing shampoo for dry hair",
            price=14.99,
            stock_quantity=40,
            sku="LOREAL-SHM-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        loreal_dry_shampoo.generate_slug()
        loreal_dry_shampoo.categories.extend([loreal, shampoos, dry_hair])
        db.session.add(loreal_dry_shampoo)

        maybelline_hair_mask = Product(
            name="Maybelline Express Repair Mask",
            description="Deep conditioning hair mask",
            price=19.99,
            stock_quantity=25,
            sku="MAYBELLINE-MSK-001",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        maybelline_hair_mask.generate_slug()
        maybelline_hair_mask.categories.extend([maybelline, hair_treatments, hair_masks])
        db.session.add(maybelline_hair_mask)

        fenty_hair_spray = Product(
            name="Fenty Hold & Shine Spray",
            description="Strong hold hair spray",
            price=22.00,
            stock_quantity=30,
            sku="FENTY-SPR-001",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        fenty_hair_spray.generate_slug()
        fenty_hair_spray.categories.extend([fenty, hair_styling, hair_spray])
        db.session.add(fenty_hair_spray)

        estee_lauder_gel_cleanser = Product(
            name="Estée Lauder Perfectly Clean Gel",
            description="Refreshing gel cleanser",
            price=28.00,
            stock_quantity=20,
            sku="ESTEE-CLS-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True
        )
        estee_lauder_gel_cleanser.generate_slug()
        estee_lauder_gel_cleanser.categories.extend([estee_lauder, cleansers, gel_cleanser])
        db.session.add(estee_lauder_gel_cleanser)

        loreal_hyaluronic_serum = Product(
            name="L’Oréal Revitalift Serum",
            description="Hydrating hyaluronic acid serum",
            price=24.99,
            discount_price=19.99,
            stock_quantity=50,
            sku="LOREAL-SER-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True,
            is_featured=True
        )
        loreal_hyaluronic_serum.generate_slug()
        loreal_hyaluronic_serum.categories.extend([loreal, serums_skincare, hyaluronic_serum, discounted_items])
        db.session.add(loreal_hyaluronic_serum)

        chanel_sheet_mask = Product(
            name="Chanel Hydra Beauty Mask",
            description="Hydrating sheet mask",
            price=60.00,
            stock_quantity=15,
            sku="CHANEL-MSK-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True
        )
        chanel_sheet_mask.generate_slug()
        chanel_sheet_mask.categories.extend([chanel, masks, sheet_masks])
        db.session.add(chanel_sheet_mask)

        fenty_spf_50 = Product(
            name="Fenty Skin Hydra Vizor SPF 50",
            description="Lightweight SPF 50 sunscreen",
            price=38.00,
            stock_quantity=25,
            sku="FENTY-SPF-001",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True
        )
        fenty_spf_50.generate_slug()
        fenty_spf_50.categories.extend([fenty, sunscreen, spf_50])
        db.session.add(fenty_spf_50)

        chanel_necklace = Product(
            name="Chanel Pearl Necklace",
            description="Elegant pearl necklace",
            price=250.00,
            stock_quantity=5,
            sku="CHANEL-NCK-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True,
            is_featured=True
        )
        chanel_necklace.generate_slug()
        chanel_necklace.categories.extend([chanel, jewelry, necklaces])
        db.session.add(chanel_necklace)

        mac_makeup_brushes = Product(
            name="MAC Brush Set",
            description="Professional makeup brush set",
            price=80.00,
            discount_price=60.00,
            stock_quantity=10,
            sku="MAC-BRS-001",
            brand="MAC Cosmetics",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True
        )
        mac_makeup_brushes.generate_slug()
        mac_makeup_brushes.categories.extend([mac, beauty_tools, makeup_brushes, clearance_items])
        db.session.add(mac_makeup_brushes)

        fenty_handbag = Product(
            name="Fenty Tote Bag",
            description="Stylish leather tote bag",
            price=150.00,
            stock_quantity=8,
            sku="FENTY-BAG-001",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True
        )
        fenty_handbag.generate_slug()
        fenty_handbag.categories.extend([fenty, bags, handbags])
        db.session.add(fenty_handbag)

        # Additional Products
        maybelline_eyeliner = Product(
            name="Maybelline Hyper Easy Eyeliner",
            description="Liquid eyeliner with precision tip by Maybelline",
            price=9.99,
            stock_quantity=60,
            sku="MAYBELLINE-EYE-002",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        maybelline_eyeliner.generate_slug()
        maybelline_eyeliner.categories.extend([maybelline, eye_makeup, eyeliner])
        db.session.add(maybelline_eyeliner)

        loreal_blush = Product(
            name="L’Oréal True Match Blush",
            description="Natural glow blush by L’Oréal",
            price=11.99,
            discount_price=9.99,
            stock_quantity=45,
            sku="LOREAL-BLS-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True,
            is_featured=True
        )
        loreal_blush.generate_slug()
        loreal_blush.categories.extend([loreal, face_makeup, blush, discounted_items])
        db.session.add(loreal_blush)

        fenty_lip_balm = Product(
            name="Fenty Skin Plush Puddin Lip Balm",
            description="Hydrating lip balm by Fenty Beauty",
            price=16.00,
            stock_quantity=30,
            sku="FENTY-LIP-002",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            is_active=True
        )
        fenty_lip_balm.generate_slug()
        fenty_lip_balm.categories.extend([fenty, lip_makeup, lip_balm])
        db.session.add(fenty_lip_balm)

        chanel_setting_powder = Product(
            name="Chanel Poudre Universelle",
            description="Translucent setting powder by Chanel",
            price=52.00,
            stock_quantity=15,
            sku="CHANEL-PWD-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        chanel_setting_powder.generate_slug()
        chanel_setting_powder.categories.extend([chanel, face_makeup, setting_powder])
        db.session.add(chanel_setting_powder)

        mac_brow_pencil = Product(
            name="MAC Veluxe Brow Pencil",
            description="Precision brow pencil by MAC",
            price=22.00,
            stock_quantity=25,
            sku="MAC-BRW-001",
            brand="MAC Cosmetics",
            image_urls=["https://images.unsplash.com/photo-1512496015851-a90fb38ba796"],
            is_active=True
        )
        mac_brow_pencil.generate_slug()
        mac_brow_pencil.categories.extend([mac, eye_makeup, brow_products])
        db.session.add(mac_brow_pencil)

        estee_lauder_lip_liner = Product(
            name="Estée Lauder Double Wear Lip Liner",
            description="Long-lasting lip liner by Estée Lauder",
            price=27.00,
            discount_price=20.00,
            stock_quantity=20,
            sku="ESTEE-LIP-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
            is_active=True
        )
        estee_lauder_lip_liner.generate_slug()
        estee_lauder_lip_liner.categories.extend([estee_lauder, lip_makeup, lip_liner, clearance_items])
        db.session.add(estee_lauder_lip_liner)

        estee_lauder_fruity_perfume = Product(
            name="Estée Lauder Beautiful Belle",
            description="Fruity floral perfume for women by Estée Lauder",
            price=95.00,
            stock_quantity=12,
            sku="ESTEE-PRF-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True,
            is_featured=True
        )
        estee_lauder_fruity_perfume.generate_slug()
        estee_lauder_fruity_perfume.categories.extend([estee_lauder, women_fragrance, fruity_w])
        db.session.add(estee_lauder_fruity_perfume)

        mac_woody_cologne = Product(
            name="MAC Shade Woody Cologne",
            description="Rich woody cologne for men by MAC",
            price=65.00,
            stock_quantity=18,
            sku="MAC-COL-001",
            brand="MAC Cosmetics",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True
        )
        mac_woody_cologne.generate_slug()
        mac_woody_cologne.categories.extend([mac, men_fragrance, woody_m])
        db.session.add(mac_woody_cologne)

        maybelline_unisex_fragrance = Product(
            name="Maybelline Fresh Breeze",
            description="Citrus unisex fragrance by Maybelline",
            price=40.00,
            discount_price=32.00,
            stock_quantity=25,
            sku="MAYBELLINE-FRG-001",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1587017977600-5866789dadf8"],
            is_active=True
        )
        maybelline_unisex_fragrance.generate_slug()
        maybelline_unisex_fragrance.categories.extend([maybelline, unisex_fragrance, citrus_u, discounted_items])
        db.session.add(maybelline_unisex_fragrance)

        chanel_hydrating_conditioner = Product(
            name="Chanel Coco Nourish Conditioner",
            description="Hydrating conditioner for all hair types",
            price=48.00,
            stock_quantity=20,
            sku="CHANEL-CND-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        chanel_hydrating_conditioner.generate_slug()
        chanel_hydrating_conditioner.categories.extend([chanel, conditioners, hydrating_cond])
        db.session.add(chanel_hydrating_conditioner)

        estee_lauder_curly_shampoo = Product(
            name="Estée Lauder Curl Perfect Shampoo",
            description="Shampoo for curly hair by Estée Lauder",
            price=30.00,
            stock_quantity=25,
            sku="ESTEE-SHM-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        estee_lauder_curly_shampoo.generate_slug()
        estee_lauder_curly_shampoo.categories.extend([estee_lauder, shampoos, curly_hair])
        db.session.add(estee_lauder_curly_shampoo)

        mac_hair_oil = Product(
            name="MAC Smooth Shine Oil",
            description="Nourishing hair oil by MAC",
            price=35.00,
            discount_price=28.00,
            stock_quantity=15,
            sku="MAC-OIL-001",
            brand="MAC Cosmetics",
            image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"],
            is_active=True
        )
        mac_hair_oil.generate_slug()
        mac_hair_oil.categories.extend([mac, hair_treatments, oils, clearance_items])
        db.session.add(mac_hair_oil)

        maybelline_day_cream = Product(
            name="Maybelline Dream Fresh Day Cream",
            description="Lightweight day cream by Maybelline",
            price=15.99,
            stock_quantity=40,
            sku="MAYBELLINE-CRM-001",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True
        )
        maybelline_day_cream.generate_slug()
        maybelline_day_cream.categories.extend([maybelline, moisturizers, day_cream])
        db.session.add(maybelline_day_cream)

        fenty_clay_mask = Product(
            name="Fenty Skin Cookies N Clean Mask",
            description="Purifying clay mask by Fenty Beauty",
            price=32.00,
            stock_quantity=20,
            sku="FENTY-MSK-002",
            brand="Fenty Beauty",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True
        )
        fenty_clay_mask.generate_slug()
        fenty_clay_mask.categories.extend([fenty, masks, clay_masks])
        db.session.add(fenty_clay_mask)

        loreal_night_cream = Product(
            name="L’Oréal Age Perfect Night Cream",
            description="Anti-aging night cream by L’Oréal",
            price=29.99,
            discount_price=24.99,
            stock_quantity=30,
            sku="LOREAL-CRM-001",
            brand="L’Oréal",
            image_urls=["https://images.unsplash.com/photo-1596755938965-6a769b598113"],
            is_active=True,
            is_featured=True
        )
        loreal_night_cream.generate_slug()
        loreal_night_cream.categories.extend([loreal, moisturizers, night_cream, discounted_items])
        db.session.add(loreal_night_cream)

        estee_lauder_earrings = Product(
            name="Estée Lauder Gold Hoop Earrings",
            description="Elegant gold hoop earrings",
            price=120.00,
            stock_quantity=10,
            sku="ESTEE-ERR-001",
            brand="Estée Lauder",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True,
            is_featured=True
        )
        estee_lauder_earrings.generate_slug()
        estee_lauder_earrings.categories.extend([estee_lauder, jewelry, earrings])
        db.session.add(estee_lauder_earrings)

        maybelline_crossbody_bag = Product(
            name="Maybelline Compact Crossbody Bag",
            description="Chic crossbody bag by Maybelline",
            price=45.00,
            discount_price=35.00,
            stock_quantity=15,
            sku="MAYBELLINE-BAG-001",
            brand="Maybelline",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True
        )
        maybelline_crossbody_bag.generate_slug()
        maybelline_crossbody_bag.categories.extend([maybelline, bags, crossbody_bags, clearance_items])
        db.session.add(maybelline_crossbody_bag)

        chanel_hair_dryer = Product(
            name="Chanel Luxe Hair Dryer",
            description="High-performance hair dryer by Chanel",
            price=200.00,
            stock_quantity=8,
            sku="CHANEL-DRY-001",
            brand="Chanel",
            image_urls=["https://images.unsplash.com/photo-1606760227091-3dd44d7f5878"],
            is_active=True
        )
        chanel_hair_dryer.generate_slug()
        chanel_hair_dryer.categories.extend([chanel, beauty_tools, hair_dryers])
        db.session.add(chanel_hair_dryer)

        db.session.commit()
        logger.info("Products added successfully.")
    except Exception as e:
        logger.error(f"Error adding products: {e}")
        db.session.rollback()
        raise

    # try:
    #     # 5. User
    #     logger.info("Seeding test user...")
    #     user = User(
    #         id=1,
    #         email='test@gmail.com',
    #         username='testuser',
    #         is_active=True
    #     )
    #     user.set_password('Password@123')
    #     db.session.add(user)
    #     db.session.commit()
    #     logger.info("Test user added successfully.")
    # except Exception as e:
    #     logger.error(f"Error adding test user: {e}")
    #     db.session.rollback()
    #     raise


    logging.info("Seeding test users...")
    try:
        users = [
            User(
                email="test1@gmail.com",
                username="testuser1",
                role="CUSTOMER",
                is_active=True
            ),
            User(
                email="test2@gmail.com",
                username="testuser2",
                role="CUSTOMER",
                is_active=True
            ),
            User(
                email="admin@gmail.com",
                username="admin",
                role="ADMIN",
                is_active=True
            )
        ]
        users[0].set_password('Password@123')
        users[1].set_password('Password@123!')
        users[2].set_password('Password@12')

        db.session.add_all(users)
        db.session.commit()
        logging.info(f"Test users added successfully: {[user.id for user in users]}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error adding test users: {str(e)}")
        raise

    try:
        # 6. Cart and Cart Items
        logger.info("Seeding cart and cart items...")
        cart = Cart(user_id=27)
        db.session.add(cart)
        db.session.commit()

        # Add cart items using valid product IDs
        cart_item1 = CartItem(cart_id=cart.id, product_id=loreal_lipstick.id, quantity=2)
        cart_item2 = CartItem(cart_id=cart.id, product_id=maybelline_foundation.id, quantity=1)
        cart_item3 = CartItem(cart_id=cart.id, product_id=loreal_mascara.id, quantity=3)
        cart_item4 = CartItem(cart_id=cart.id, product_id=fenty_highlighter.id, quantity=1)
        cart_item5 = CartItem(cart_id=cart.id, product_id=estee_lauder_gel_cleanser.id, quantity=2)
        db.session.add(cart_item1)
        db.session.add(cart_item2)
        db.session.add(cart_item3)
        db.session.add(cart_item4)
        db.session.add(cart_item5)
        db.session.commit()
        logger.info("Cart and cart items added successfully.")
    except Exception as e:
        logger.error(f"Error adding cart and cart items: {e}")
        db.session.rollback()
        raise

    try:
        # 7. Orders
        logger.info("Seeding test orders...")

        # Order 1: Completed M-Pesa order (standard shipping)
        order1 = Order(
            user_id=27,
            total=53.97,  # (2 * 12.99) + 12.99 + 10.99 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.COMPLETED.value,
            delivery_status=DeliveryStatus.DELIVERED.value,
            transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}",
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with M-Pesa payment',
            created_at=datetime.now(timezone.utc).replace(day=1, month=4, year=2025)
        )
        db.session.add(order1)
        db.session.flush()

        order1_items = [
            OrderItem(order_id=order1.id, product_id=loreal_lipstick.id, quantity=2, unit_price=12.99),
            OrderItem(order_id=order1.id, product_id=maybelline_foundation.id, quantity=1, unit_price=12.99),
            OrderItem(order_id=order1.id, product_id=loreal_mascara.id, quantity=1, unit_price=10.99)
        ]
        for item in order1_items:
            db.session.add(item)

        order1_address = Address(
            order_id=order1.id,
            full_name="Test User",
            phone="+254123456789",
            postal_address="123 Main St",
            city="Nairobi",
            country="Kenya"
        )
        db.session.add(order1_address)

        order1_invoice = Invoice(
            order_id=order1.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total=53.97,
            transaction_id=order1.transaction_id,
            status=PaymentStatus.COMPLETED.value,
            issued_at=order1.created_at
        )
        db.session.add(order1_invoice)

        # Order 2: Pending pay on delivery order (express shipping)
        order2 = Order(
            user_id=28,
            total=90.99,  # 36.00 + 30.00 + 9.99 + 15.00 (shipping)
            shipping_cost=15.00,
            payment_status=PaymentStatus.PENDING.value,
            delivery_status=DeliveryStatus.PENDING.value,
            shipping_method='express',
            payment_method='pay_on_delivery',
            description='Test order with pay on delivery',
            created_at=datetime.now(timezone.utc).replace(day=15, month=4, year=2025)
        )
        db.session.add(order2)
        db.session.flush()

        order2_items = [
            OrderItem(order_id=order2.id, product_id=fenty_highlighter.id, quantity=1, unit_price=36.00),
            OrderItem(order_id=order2.id, product_id=chanel_lip_gloss.id, quantity=1, unit_price=30.00),
            OrderItem(order_id=order2.id, product_id=loreal_blush.id, quantity=1, unit_price=9.99)
        ]
        for item in order2_items:
            db.session.add(item)

        order2_address = Address(
            order_id=order2.id,
            full_name="Test User",
            phone="+254987654321",
            postal_address="456 Elm St",
            city="Mombasa",
            country="Kenya"
        )
        db.session.add(order2_address)

        order2_invoice = Invoice(
            order_id=order2.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total=90.99,
            transaction_id=None,
            status=PaymentStatus.PENDING.value,
            issued_at=order2.created_at
        )
        db.session.add(order2_invoice)

        # Order 3: Failed M-Pesa order (standard shipping)
        order3 = Order(
            user_id=29,
            total=159.98,  # 120.00 + 24.99 + 9.99 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.FAILED.value,
            delivery_status=DeliveryStatus.PENDING.value,
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with failed M-Pesa payment',
            created_at=datetime.now(timezone.utc).replace(day=20, month=4, year=2025)
        )
        db.session.add(order3)
        db.session.flush()

        order3_items = [
            OrderItem(order_id=order3.id, product_id=chanel_floral_perfume.id, quantity=1, unit_price=120.00),
            OrderItem(order_id=order3.id, product_id=loreal_night_cream.id, quantity=1, unit_price=24.99),
            OrderItem(order_id=order3.id, product_id=maybelline_eyeliner.id, quantity=1, unit_price=9.99)
        ]
        for item in order3_items:
            db.session.add(item)

        order3_address = Address(
            order_id=order3.id,
            full_name="Test User",
            phone="+254123456789",
            postal_address="789 Oak St",
            city="Kisumu",
            country="Kenya"
        )
        db.session.add(order3_address)

        order3_invoice = Invoice(
            order_id=order3.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total=159.98,
            transaction_id=None,
            status=PaymentStatus.FAILED.value,
            issued_at=order3.created_at
        )
        db.session.add(order3_invoice)

        # Order 4: Initiated M-Pesa order (standard shipping)
        order4 = Order(
            user_id=27,
            total=84.98,  # 19.99 + 60.00 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.INITIATED.value,
            delivery_status=DeliveryStatus.PENDING.value,
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with M-Pesa payment',
            created_at=datetime.now(timezone.utc).replace(day=25, month=4, year=2025)
        )
        db.session.add(order4)
        db.session.flush()

        order4_items = [
            OrderItem(order_id=order4.id, product_id=loreal_hyaluronic_serum.id, quantity=1, unit_price=19.99),
            OrderItem(order_id=order4.id, product_id=chanel_sheet_mask.id, quantity=1, unit_price=60.00)
        ]
        for item in order4_items:
            db.session.add(item)

        order4_address = Address(
            order_id=order4.id,
            full_name="Test User",
            phone="+254712345678",
            postal_address="101 Pine St",
            city="Nairobi",
            country="Kenya"
        )
        db.session.add(order4_address)

        order4_invoice = Invoice(
            order_id=order4.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total=84.98,
            transaction_id=None,
            status=PaymentStatus.INITIATED.value,
            issued_at=order4.created_at
        )
        db.session.add(order4_invoice)

        db.session.commit()
        logger.info("Test orders added successfully.")
    except Exception as e:
        logger.error(f"Error adding test orders: {e}")
        db.session.rollback()
        raise

    try:
        # 8. Reviews
        logger.info("Seeding reviews...")
        reviews = [
            Review(
                product_id=loreal_lipstick.id,
                user_id=27,
                rating=4,
                comment="Love the matte finish, stays on all day!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=2, month=4, year=2025)
            ),
            Review(
                product_id=loreal_lipstick.id,
                user_id=28,
                rating=3,
                comment="Nice color but a bit drying.",
                created_at=datetime.now(timezone.utc).replace(day=3, month=4, year=2025)
            ),
            Review(
                product_id=maybelline_foundation.id,
                user_id=29,
                rating=5,
                comment="Perfect match for my skin tone, great coverage!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=4, month=4, year=2025)
            ),
            Review(
                product_id=fenty_highlighter.id,
                user_id=27,
                rating=4,
                comment="Gives a beautiful glow, but a bit pricey.",
                created_at=datetime.now(timezone.utc).replace(day=5, month=4, year=2025)
            ),
            Review(
                product_id=chanel_floral_perfume.id,
                user_id=28,
                rating=5,
                comment="Amazing scent, feels so luxurious!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=6, month=4, year=2025)
            ),
            Review(
                product_id=loreal_hyaluronic_serum.id,
                user_id=29,
                rating=4,
                comment="Hydrates well, great for daily use.",
                created_at=datetime.now(timezone.utc).replace(day=7, month=4, year=2025)
            )
        ]
        db.session.add_all(reviews)
        db.session.commit()
        logger.info("Reviews added successfully.")
    except Exception as e:
        logger.error(f"Error adding reviews: {e}")
        db.session.rollback()
        raise

    logger.info("Atelier-de-Beauty database seeded successfully with categories, products, user, cart, and orders!")

if __name__ == "__main__":
    with app.app_context():
        try:
            seed_data()
        except Exception as e:
            logger.error(f"Seeding failed: {e}")
            raise