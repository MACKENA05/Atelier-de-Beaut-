import logging
from sqlalchemy.sql import text
from sqlalchemy import inspect
from extensions import db
from app import create_app
from models.category import Category
from models.product import Product
from models.user import User, UserRole
from models.cart import Cart, CartItem
from models.order import Order, OrderItem, Address, Invoice, PaymentStatus, DeliveryStatus,OrderStatus
from models.review import Review
from werkzeug.security import generate_password_hash
import uuid
from datetime import datetime, timezone,timedelta

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
        brands = Category(name="Brands", description="Shop by favorite brands", image_urls=["https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.stylist.co.uk%2Fbeauty%2Fskincare%2Fbest-affordable-skincare-brands%2F377662&psig=AOvVaw2GZdZJMIrrdd-KlEx6b-dU&ust=1746178045519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiq9rv6gY0DFQAAAAAdAAAAABAE"], is_featured=True, display_order=1)
        brands.generate_slug()
        db.session.add(brands)

        makeup = Category(name="Makeup", description="Explore makeup products", image_urls=["https://i.pinimg.com/736x/26/f4/69/26f46919239877ddb571feba90325211.jpg"], is_featured=True, display_order=2)
        makeup.generate_slug()
        db.session.add(makeup)

        fragrance = Category(name="Fragrance", description="Discover perfumes and colognes", image_urls=["https://i.pinimg.com/736x/22/df/6e/22df6ed9d4b40fd2e02ce32090bb0d60.jpg"], is_featured=True, display_order=3)
        fragrance.generate_slug()
        db.session.add(fragrance)

        haircare = Category(name="Haircare", description="Shampoos, conditioners, and styling products", image_urls=["https://images.unsplash.com/photo-1608248543855-435f913d73a9"], is_featured=True, display_order=4)
        haircare.generate_slug()
        db.session.add(haircare)

        skincare = Category(name="Skincare", description="Cleansers, moisturizers, and more", image_urls=["https://i.pinimg.com/736x/25/00/18/25001882addbaf93d577bbc24289f876.jpg"], is_featured=True, display_order=5)
        skincare.generate_slug()
        db.session.add(skincare)

        accessories = Category(name="Accessories", description="Jewelry, bags, and beauty tools", image_urls=["https://i.pinimg.com/736x/b5/23/dc/b523dce4fa9c944bcae6a7c082a0fbc6.jpg"], is_featured=True, display_order=6)
        accessories.generate_slug()
        db.session.add(accessories)

        deals = Category(name="Deals", description="Special offers and clearance items", image_urls=["https://i.pinimg.com/736x/34/19/05/341905a719478c374a12b097582a1be5.jpg"], is_featured=True, display_order=7)
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
        loreal = Category(name="L’Oréal", description="L’Oréal Paris products", image_urls=["https://i.pinimg.com/736x/c2/10/2d/c2102d94cb453eaaa9aeba8791909900.jpg"], parent_id=brands.id, display_order=1)
        loreal.generate_slug()
        db.session.add(loreal)

        estee_lauder = Category(name="Estée Lauder", description="Estée Lauder luxury products", image_urls=["https://i.pinimg.com/736x/1a/4e/e8/1a4ee88028256a5954a3dada2b20a749.jpg"], parent_id=brands.id, display_order=2)
        estee_lauder.generate_slug()
        db.session.add(estee_lauder)

        chanel = Category(name="Chanel", description="Chanel beauty products", image_urls=["https://i.pinimg.com/736x/d7/e0/de/d7e0def99b7396921ab95b90a31981dd.jpg"], parent_id=brands.id, display_order=3)
        chanel.generate_slug()
        db.session.add(chanel)

        mac = Category(name="MAC Cosmetics", description="MAC professional makeup", image_urls=["https://i.pinimg.com/736x/8f/8d/7a/8f8d7a7681d960ae7eaf1e7f5399981e.jpg"], parent_id=brands.id, display_order=4)
        mac.generate_slug()
        db.session.add(mac)

        maybelline = Category(name="Maybelline", description="Maybelline New York products", image_urls=["https://i.pinimg.com/736x/73/81/6c/73816c55216f8e77e9bd93efccfa80c7.jpg"], parent_id=brands.id, display_order=5)
        maybelline.generate_slug()
        db.session.add(maybelline)

        fenty = Category(name="Fenty Beauty", description="Fenty Beauty by Rihanna", image_urls=["https://i.pinimg.com/736x/9b/30/b7/9b30b7f3ead3f83b3cf134314ecea7ce.jpg"], parent_id=brands.id, display_order=6)
        fenty.generate_slug()
        db.session.add(fenty)

        # Makeup
        face_makeup = Category(name="Face Makeup", description="Foundation, concealer, and more", image_urls=["https://i.pinimg.com/736x/d7/ad/5c/d7ad5c92f9e129f98cdae550b228df83.jpg"], parent_id=makeup.id, display_order=1)
        face_makeup.generate_slug()
        db.session.add(face_makeup)

        eye_makeup = Category(name="Eye Makeup", description="Mascara, eyeliner, and eyeshadow", image_urls=["https://i.pinimg.com/736x/78/47/62/7847626beabbf8c3565563cd36c77e72.jpg"], parent_id=makeup.id, display_order=2)
        eye_makeup.generate_slug()
        db.session.add(eye_makeup)

        lip_makeup = Category(name="Lip Makeup", description="Lipstick, gloss, and liners", image_urls=["https://i.pinimg.com/736x/6d/3a/8d/6d3a8d50ee8b8aa0114c8a2a63191eed.jpg"], parent_id=makeup.id, display_order=3)
        lip_makeup.generate_slug()
        db.session.add(lip_makeup)

        # Fragrance
        women_fragrance = Category(name="Women's Fragrance", description="Perfumes for women", image_urls=["https://i.pinimg.com/736x/2b/9b/25/2b9b2541f894985f411b13cf93439910.jpg"], parent_id=fragrance.id, display_order=1)
        women_fragrance.generate_slug()
        db.session.add(women_fragrance)

        men_fragrance = Category(name="Men's Fragrance", description="Colognes for men", image_urls=["https://i.pinimg.com/736x/88/8a/34/888a34e5fdd41285190b0aa9cbb9bac2.jpg"], parent_id=fragrance.id, display_order=2)
        men_fragrance.generate_slug()
        db.session.add(men_fragrance)

        unisex_fragrance = Category(name="Unisex Fragrance", description="Fragrances for all", image_urls=["https://i.pinimg.com/736x/9e/df/50/9edf50223d175a87de6dc475742033df.jpg"], parent_id=fragrance.id, display_order=3)
        unisex_fragrance.generate_slug()
        db.session.add(unisex_fragrance)

        # Haircare
        shampoos = Category(name="Shampoos", description="Cleansing for all hair types", image_urls=["https://i.pinimg.com/736x/60/0f/b2/600fb2cbbdf22e070e76d0be36cda9e6.jpg"], parent_id=haircare.id, display_order=1)
        shampoos.generate_slug()
        db.session.add(shampoos)

        conditioners = Category(name="Conditioners", description="Nourishing conditioners", image_urls=["https://i.pinimg.com/736x/41/47/41/4147418a8ecb9e4a712ac7818bc051ff.jpg"], parent_id=haircare.id, display_order=2)
        conditioners.generate_slug()
        db.session.add(conditioners)

        hair_treatments = Category(name="Hair Treatments", description="Masks, serums, and oils", image_urls=["https://i.pinimg.com/736x/0e/d0/c1/0ed0c15787f813f4e027587d3cbac6ea.jpg"], parent_id=haircare.id, display_order=3)
        hair_treatments.generate_slug()
        db.session.add(hair_treatments)

        hair_styling = Category(name="Hair Styling", description="Gels, mousses, and sprays", image_urls=["https://i.pinimg.com/736x/a9/a1/4c/a9a14c22e1c3170e8666d875cc950a50.jpg"], parent_id=haircare.id, display_order=4)
        hair_styling.generate_slug()
        db.session.add(hair_styling)

        # Skincare
        cleansers = Category(name="Cleansers", description="Foaming, cream, and gel cleansers", image_urls=["https://i.pinimg.com/736x/7f/fb/85/7ffb85c6c84ab543fb9b20162b15bd65.jpg"], parent_id=skincare.id, display_order=1)
        cleansers.generate_slug()
        db.session.add(cleansers)

        moisturizers = Category(name="Moisturizers", description="Day, night, and gel moisturizers", image_urls=["https://i.pinimg.com/736x/84/76/00/84760097c730804639d223b5912f0877.jpg"], parent_id=skincare.id, display_order=2)
        moisturizers.generate_slug()
        db.session.add(moisturizers)

        serums_skincare = Category(name="Serums", description="Targeted skincare serums", image_urls=["https://i.pinimg.com/736x/6a/02/6b/6a026b9d52148e2e4daa9e2690cb8f86.jpg"], parent_id=skincare.id, display_order=3)
        serums_skincare.generate_slug()
        db.session.add(serums_skincare)

        masks = Category(name="Masks", description="Sheet, clay, and peel-off masks", image_urls=["https://i.pinimg.com/736x/9e/cd/a9/9ecda9f957229d60a28afd59b822cf26.jpg"], parent_id=skincare.id, display_order=4)
        masks.generate_slug()
        db.session.add(masks)

        sunscreen = Category(name="Sunscreen", description="SPF protection", image_urls=["https://i.pinimg.com/736x/86/17/e0/8617e0a83ef68258776356a1ceed9d30.jpg"], parent_id=skincare.id, display_order=5)
        sunscreen.generate_slug()
        db.session.add(sunscreen)

        # Accessories
        jewelry = Category(name="Jewelry", description="Necklaces, earrings, and more", image_urls=["https://i.pinimg.com/736x/68/c4/4b/68c44befa7c439489d1a161202f33362.jpg"], parent_id=accessories.id, display_order=1)
        jewelry.generate_slug()
        db.session.add(jewelry)

        bags = Category(name="Bags", description="Handbags, wallets, and crossbody bags", image_urls=["https://i.pinimg.com/736x/29/20/4d/29204d3e8c632e6a3cdaa488c0c7c441.jpg"], parent_id=accessories.id, display_order=2)
        bags.generate_slug()
        db.session.add(bags)

        beauty_tools = Category(name="Beauty Tools", description="Brushes, dryers, and more", image_urls=["https://i.pinimg.com/736x/7a/52/54/7a52541c4dc90dfbe95ef7b48d05fbaf.jpg"], parent_id=accessories.id, display_order=3)
        beauty_tools.generate_slug()
        db.session.add(beauty_tools)

        # Deals
        discounted_items = Category(name="Discounted Items", description="Special discounts", image_urls=["https://i.pinimg.com/736x/4d/26/6f/4d266f067920578316287a6afa4b120e.jpg"], parent_id=deals.id, display_order=1)
        discounted_items.generate_slug()
        db.session.add(discounted_items)

        clearance_items = Category(name="Clearance Items", description="Clearance products", image_urls=["https://i.pinimg.com/736x/73/59/af/7359af5da3abbe1e9efcf9ec8afc8bb4.jpg"], parent_id=deals.id, display_order=2)
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
        foundation = Category(name="Foundation", description="Liquid and powder foundations", image_urls=["https://i.pinimg.com/736x/34/53/cd/3453cde2c0ecd5f1f022c1b04c0bc6e2.jpg"], parent_id=face_makeup.id, display_order=1)
        foundation.generate_slug()
        db.session.add(foundation)

        concealer = Category(name="Concealer", description="Concealers for all skin types", image_urls=["https://i.pinimg.com/736x/c1/d6/03/c1d60395e11893a9b890db59cf5ded57.jpg"], parent_id=face_makeup.id, display_order=2)
        concealer.generate_slug()
        db.session.add(concealer)

        blush = Category(name="Blush", description="Powder and cream blushes", image_urls=["https://i.pinimg.com/736x/00/a0/9d/00a09d2c6f38a63681e4598692aa79ef.jpg"], parent_id=face_makeup.id, display_order=3)
        blush.generate_slug()
        db.session.add(blush)

        highlighter = Category(name="Highlighter", description="Glow-enhancing highlighters", image_urls=["https://i.pinimg.com/736x/d2/30/08/d23008caf97ffc8a3241b23aee2f1589.jpg"], parent_id=face_makeup.id, display_order=4)
        highlighter.generate_slug()
        db.session.add(highlighter)

        setting_powder = Category(name="Setting Powder", description="Matte and translucent powders", image_urls=["https://i.pinimg.com/736x/c1/9a/df/c19adfa05172471db601a9a77a2f98a1.jpg"], parent_id=face_makeup.id, display_order=5)
        setting_powder.generate_slug()
        db.session.add(setting_powder)

        # Makeup -> Eye Makeup
        mascara = Category(name="Mascara", description="Volumizing and lengthening mascaras", image_urls=["https://i.pinimg.com/736x/b8/7f/6c/b87f6c4a558d64311b76900acf5fcd4c.jpg"], parent_id=eye_makeup.id, display_order=1)
        mascara.generate_slug()
        db.session.add(mascara)

        eyeliner = Category(name="Eyeliner", description="Liquid and pencil eyeliners", image_urls=["https://i.pinimg.com/736x/40/82/83/4082835af46823a19ac3a75671eebe1a.jpg"], parent_id=eye_makeup.id, display_order=2)
        eyeliner.generate_slug()
        db.session.add(eyeliner)

        eyeshadow = Category(name="Eyeshadow", description="Palettes and single shadows", image_urls=["https://i.pinimg.com/736x/65/50/78/655078392bd30df98a95dba34a7b1f33.jpg"], parent_id=eye_makeup.id, display_order=3)
        eyeshadow.generate_slug()
        db.session.add(eyeshadow)

        brow_products = Category(name="Brow Products", description="Pencils, gels, and powders", image_urls=["https://i.pinimg.com/736x/de/4b/ea/de4bea1377a9bc03ff941024ea1ca2e1.jpg"], parent_id=eye_makeup.id, display_order=4)
        brow_products.generate_slug()
        db.session.add(brow_products)

        # Makeup -> Lip Makeup
        lipstick = Category(name="Lipstick", description="Matte, satin, and glossy lipsticks", image_urls=["https://i.pinimg.com/736x/9c/23/b3/9c23b3d182a53039df43fda5a74d530c.jpg"], parent_id=lip_makeup.id, display_order=1)
        lipstick.generate_slug()
        db.session.add(lipstick)

        lip_gloss = Category(name="Lip Gloss", description="Shiny and non-sticky glosses", image_urls=["https://i.pinimg.com/736x/0b/95/89/0b95893216f8d4f8d44fe1ff9cd474ba.jpg"], parent_id=lip_makeup.id, display_order=2)
        lip_gloss.generate_slug()
        db.session.add(lip_gloss)

        lip_liner = Category(name="Lip Liner", description="Precise lip liners", image_urls=["https://i.pinimg.com/736x/0c/30/07/0c30075036320e288013d78bb2b7ee71.jpg"], parent_id=lip_makeup.id, display_order=3)
        lip_liner.generate_slug()
        db.session.add(lip_liner)

        lip_balm = Category(name="Lip Balm", description="Hydrating lip balms", image_urls=["https://m.media-amazon.com/images/I/61FmCQB4VlL.jpg"], parent_id=lip_makeup.id, display_order=4)
        lip_balm.generate_slug()
        db.session.add(lip_balm)

        # Fragrance -> Women's Fragrance
        floral_w = Category(name="Floral", description="Floral women's fragrances", image_urls=["https://i.pinimg.com/736x/7c/dd/b0/7cddb0d5880d40dc65be977e64b361b2.jpg"], parent_id=women_fragrance.id, display_order=1)
        floral_w.generate_slug()
        db.session.add(floral_w)

        fruity_w = Category(name="Fruity", description="Fruity women's fragrances", image_urls=["https://i.pinimg.com/736x/1c/4d/b0/1c4db0ce16cdb3ad21700fd0d1eb7e9a.jpg"], parent_id=women_fragrance.id, display_order=2)
        fruity_w.generate_slug()
        db.session.add(fruity_w)

        # Fragrance -> Men's Fragrance
        fresh_m = Category(name="Fresh", description="Fresh men's colognes", image_urls=["https://i.pinimg.com/736x/88/8a/34/888a34e5fdd41285190b0aa9cbb9bac2.jpg"], parent_id=men_fragrance.id, display_order=1)
        fresh_m.generate_slug()
        db.session.add(fresh_m)

        woody_m = Category(name="Woody", description="Woody men's colognes", image_urls=["https://i.pinimg.com/736x/f4/9d/1e/f49d1e967ec3f16a22acc11326ae9da4.jpg"], parent_id=men_fragrance.id, display_order=2)
        woody_m.generate_slug()
        db.session.add(woody_m)

        # Fragrance -> Unisex Fragrance
        citrus_u = Category(name="Citrus", description="Citrus unisex fragrances", image_urls=["https://i.pinimg.com/736x/30/91/9a/30919a56e3b622484af013fed00ad810.jpg"], parent_id=unisex_fragrance.id, display_order=1)
        citrus_u.generate_slug()
        db.session.add(citrus_u)

        # Haircare -> Shampoos
        dry_hair = Category(name="For Dry Hair", description="Shampoos for dry hair", image_urls=["https://i.pinimg.com/736x/e1/c2/b5/e1c2b59ec48f18c4de704b88f4a7c9e1.jpg"], parent_id=shampoos.id, display_order=1)
        dry_hair.generate_slug()
        db.session.add(dry_hair)

        curly_hair = Category(name="For Curly Hair", description="Shampoos for curly hair", image_urls=["https://i.pinimg.com/736x/26/01/63/2601637885d55ecb44420855e8725139.jpg"], parent_id=shampoos.id, display_order=2)
        curly_hair.generate_slug()
        db.session.add(curly_hair)

        # Haircare -> Conditioners
        hydrating_cond = Category(name="Hydrating Conditioner", description="Moisturizing conditioners", image_urls=["https://i.pinimg.com/736x/c0/e6/e9/c0e6e984c4db6bde9bd5880d737a0257.jpg"], parent_id=conditioners.id, display_order=1)
        hydrating_cond.generate_slug()
        db.session.add(hydrating_cond)

        # Haircare -> Hair Treatments
        hair_masks = Category(name="Hair Masks", description="Deep conditioning masks", image_urls=["https://i.pinimg.com/736x/77/53/36/775336b39600fcefa1391e30dd35decb.jpg"], parent_id=hair_treatments.id, display_order=1)
        hair_masks.generate_slug()
        db.session.add(hair_masks)

        oils = Category(name="Oils", description="Nourishing hair oils", image_urls=["https://i.pinimg.com/736x/d6/72/f7/d672f70133a3299588973b4fa84dc27e.jpg"], parent_id=hair_treatments.id, display_order=2)
        oils.generate_slug()
        db.session.add(oils)

        # Haircare -> Hair Styling
        hair_spray = Category(name="Hair Spray", description="Hold and shine sprays", image_urls=["https://i.pinimg.com/736x/98/b2/f8/98b2f81101318595f949fe74680172e1.jpg"], parent_id=hair_styling.id, display_order=1)
        hair_spray.generate_slug()
        db.session.add(hair_spray)

        # Skincare -> Cleansers
        gel_cleanser = Category(name="Gel Cleanser", description="Refreshing gel cleansers", image_urls=["https://i.pinimg.com/736x/f5/bd/71/f5bd711b0f37c8940dfc306c351030d0.jpg"], parent_id=cleansers.id, display_order=1)
        gel_cleanser.generate_slug()
        db.session.add(gel_cleanser)

        # Skincare -> Moisturizers
        day_cream = Category(name="Day Cream", description="Daytime moisturizers", image_urls=["https://i.pinimg.com/736x/71/44/f0/7144f007a6f890a4182019db879965e7.jpg"], parent_id=moisturizers.id, display_order=1)
        day_cream.generate_slug()
        db.session.add(day_cream)

        night_cream = Category(name="Night Cream", description="Overnight moisturizers", image_urls=["https://i.pinimg.com/736x/cc/54/d2/cc54d28025e8f00b323c0cecca1c4efb.jpg"], parent_id=moisturizers.id, display_order=2)
        night_cream.generate_slug()
        db.session.add(night_cream)

        # Skincare -> Serums
        hyaluronic_serum = Category(name="Hyaluronic Acid Serum", description="Hydrating serums", image_urls=["https://i.pinimg.com/736x/33/5b/a0/335ba0a3ff5cd9c43a5754cdfa1f30cf.jpg"], parent_id=serums_skincare.id, display_order=1)
        hyaluronic_serum.generate_slug()
        db.session.add(hyaluronic_serum)

        # Skincare -> Masks
        sheet_masks = Category(name="Sheet Masks", description="Hydrating sheet masks", image_urls=["https://i.pinimg.com/736x/75/ed/64/75ed6422d5f192212dc6e3c295234cb6.jpg"], parent_id=masks.id, display_order=1)
        sheet_masks.generate_slug()
        db.session.add(sheet_masks)

        clay_masks = Category(name="Clay Masks", description="Purifying clay masks", image_urls=["https://i.pinimg.com/736x/25/10/20/251020a0aa178b5b85796ba988be4634.jpg"], parent_id=masks.id, display_order=2)
        clay_masks.generate_slug()
        db.session.add(clay_masks)

        # Skincare -> Sunscreen
        spf_50 = Category(name="SPF 50", description="High SPF protection", image_urls=["https://i.pinimg.com/736x/26/65/2c/26652ce68794c338c4261f74e4d59089.jpg"], parent_id=sunscreen.id, display_order=1)
        spf_50.generate_slug()
        db.session.add(spf_50)

        # Accessories -> Jewelry
        necklaces = Category(name="Necklaces", description="Stylish necklaces", image_urls=["https://i.pinimg.com/1200x/15/33/f8/1533f8f9ed152fcfd55e9adba8c81479.jpg"], parent_id=jewelry.id, display_order=1)
        necklaces.generate_slug()
        db.session.add(necklaces)

        earrings = Category(name="Earrings", description="Elegant earrings", image_urls=["https://i.pinimg.com/736x/6c/c2/7c/6cc27c2bd043e2ae93c76d6d6e129958.jpg"], parent_id=jewelry.id, display_order=2)
        earrings.generate_slug()
        db.session.add(earrings)

        # Accessories -> Bags
        handbags = Category(name="Handbags", description="Fashionable handbags", image_urls=["https://i.pinimg.com/736x/bd/9a/de/bd9adede684c5ae0d4a68f9bd271d8e6.jpg"], parent_id=bags.id, display_order=1)
        handbags.generate_slug()
        db.session.add(handbags)

        crossbody_bags = Category(name="Crossbody Bags", description="Chic crossbody bags", image_urls=["https://i.pinimg.com/736x/9d/96/a5/9d96a587d78d62c66e7ebc4081aa436d.jpg"], parent_id=bags.id, display_order=2)
        crossbody_bags.generate_slug()
        db.session.add(crossbody_bags)

        # Accessories -> Beauty Tools
        makeup_brushes = Category(name="Makeup Brushes", description="Professional makeup brushes", image_urls=["https://i.pinimg.com/1200x/5e/57/aa/5e57aa0aadef03c5820b2463a92e68a4.jpg"], parent_id=beauty_tools.id, display_order=1)
        makeup_brushes.generate_slug()
        db.session.add(makeup_brushes)

        hair_dryers = Category(name="Hair Dryers", description="High-performance hair dryers", image_urls=["https://i.pinterest.com/736x/4d/ab/27/4dab27ac5f3099510447409b64857b1e.jpg"], parent_id=beauty_tools.id, display_order=2)
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
            price=1549.99,
            discount_price=1299.99,
            stock_quantity=50,
            sku="LOREAL-LIP-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/7c/a2/30/7ca23058ebcda12889f4f26f60e9704d.jpg","https://i.pinimg.com/736x/f2/ca/c0/f2cac007b7bba1374c7bad53c87d583f.jpg","https://i.pinimg.com/736x/35/73/1a/35731ab409042621f52698e21742eaa7.jpg"],
            is_active=True,
            is_featured=True
        )
        loreal_lipstick.generate_slug()
        loreal_lipstick.categories.extend([loreal, lip_makeup, lipstick, discounted_items])
        db.session.add(loreal_lipstick)

        maybelline_foundation = Product(
            name="Maybelline Fit Me Foundation",
            description="Natural finish foundation by Maybelline",
            price=450.99,
            stock_quantity=30,
            sku="MAYBELLINE-FND-001",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/1200x/ae/80/ef/ae80ef1c5b62cc17f81849d4f689ae16.jpg","https://i.pinimg.com/736x/8f/19/fa/8f19fa8f444a422bcccbed53869535f7.jpg","https://i.pinimg.com/736x/ad/1e/5a/ad1e5a980e1d878175eb08f2456bf112.jpg"],
            is_active=True
        )
        maybelline_foundation.generate_slug()
        maybelline_foundation.categories.extend([maybelline, face_makeup, foundation])
        db.session.add(maybelline_foundation)

        loreal_mascara = Product(
            name="L’Oréal Voluminous Mascara",
            description="Volumizing mascara by L’Oréal",
            price=245.99,
            stock_quantity=40,
            sku="LOREAL-MSC-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/8e/14/64/8e14646231f84d06d8dd1ee072854e78.jpg","https://i.pinimg.com/736x/d3/c9/44/d3c944ab7f45a74512ef49d4bd5f11c4.jpg","https://i.pinimg.com/736x/9b/5e/e1/9b5ee19abe43954ce15a53e38405275c.jpg"],
            is_active=True
        )
        loreal_mascara.generate_slug()
        loreal_mascara.categories.extend([loreal, eye_makeup, mascara])
        db.session.add(loreal_mascara)

        fenty_highlighter = Product(
            name="Fenty Killawatt Highlighter",
            description="Radiant highlighter by Fenty Beauty",
            price=360.00,
            stock_quantity=25,
            sku="FENTY-HLT-001",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/736x/5f/4b/9f/5f4b9f194cd001428e3a25c16e361f66.jpg","https://i.pinimg.com/736x/5b/63/3b/5b633bc57df8b0e96b05ec43db779f86.jpg","https://i.pinimg.com/736x/36/bf/b8/36bfb8e58f00989091601535012c4ebc.jpg"],
            is_active=True,
            is_featured=True
        )
        fenty_highlighter.generate_slug()
        fenty_highlighter.categories.extend([fenty, face_makeup, highlighter])
        db.session.add(fenty_highlighter)

        mac_eyeshadow = Product(
            name="MAC Eyeshadow Palette",
            description="Vibrant eyeshadow palette by MAC",
            price=450.00,
            stock_quantity=20,
            sku="MAC-EYE-001",
            brand="MAC Cosmetics",
            image_urls=["https://i.pinimg.com/736x/d0/b0/a5/d0b0a521f24a67795f7b3a891b5c6dba.jpg","https://www.pinterest.com/pin/139330182215910592/","https://i.pinimg.com/736x/2d/57/94/2d579457131eaf670371df4f3a516617.jpg"],
            is_active=True
        )
        mac_eyeshadow.generate_slug()
        mac_eyeshadow.categories.extend([mac, eye_makeup, eyeshadow])
        db.session.add(mac_eyeshadow)

        chanel_lip_gloss = Product(
            name="Chanel Rouge Coco Gloss",
            description="Hydrating lip gloss by Chanel",
            price=380.00,
            discount_price=250.00,
            stock_quantity=15,
            sku="CHANEL-GLS-001",
            brand="Chanel",
            image_urls=["https://i.pinimg.com/736x/9f/75/5a/9f755ac45081bfa481625acbcff7ffab.jpg","https://i.pinimg.com/736x/9b/bb/ca/9bbbca2812a63e81b00ba6304a9d042d.jpg","https://i.pinimg.com/736x/3d/8f/d3/3d8fd3a2f15256f4bd4f27eb2899b6db.jpg"],
            is_active=True,
            is_featured=True
        )
        chanel_lip_gloss.generate_slug()
        chanel_lip_gloss.categories.extend([chanel, lip_makeup, lip_gloss, discounted_items])
        db.session.add(chanel_lip_gloss)

        estee_lauder_concealer = Product(
            name="Estée Lauder Double Wear Concealer",
            description="Long-wear concealer by Estée Lauder",
            price=900.00,
            stock_quantity=850.00,
            sku="ESTEE-CON-001",
            brand="Estée Lauder",
            image_urls=["https://i.pinimg.com/736x/54/69/fb/5469fb0888eaae621d096d75679e5a8e.jpg","https://i.pinimg.com/736x/41/ef/e4/41efe460cb3e150755926f5558882a9e.jpg","https://i.pinimg.com/736x/a4/be/5c/a4be5c871ad60d5b4b215b34cebfaba6.jpg"],
            is_active=True
        )
        estee_lauder_concealer.generate_slug()
        estee_lauder_concealer.categories.extend([estee_lauder, face_makeup, concealer])
        db.session.add(estee_lauder_concealer)

        chanel_floral_perfume = Product(
            name="Chanel Chance Eau Tendre",
            description="Floral perfume for women by Chanel",
            price=1200.00,
            stock_quantity=10,
            sku="CHANEL-PRF-001",
            brand="Chanel",
            image_urls=["https://i.pinimg.com/736x/e2/47/e0/e247e03ca66d9a5d40e0b6170e4586fd.jpg","https://i.pinimg.com/736x/4c/20/26/4c202697b7bc3ff2f63def7c6690ba01.jpg","https://i.pinimg.com/736x/b6/6a/7e/b66a7e992ca46b0236f1c317e2886c72.jpg"],
            is_active=True,
            is_featured=True
        )
        chanel_floral_perfume.generate_slug()
        chanel_floral_perfume.categories.extend([chanel, women_fragrance, floral_w])
        db.session.add(chanel_floral_perfume)

        loreal_men_cologne = Product(
            name="L’Oréal Men Expert Cologne",
            description="Fresh cologne for men by L’Oréal",
            price=1450.00,
            discount_price=999.99,
            stock_quantity=20,
            sku="LOREAL-COL-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/a2/16/c6/a216c6961d9679665a1805e6ee537b56.jpg","https://i.pinimg.com/736x/ee/92/e5/ee92e59d0d088b6e9eeab54862089f68.jpg","https://i.pinimg.com/736x/c2/47/c6/c247c642060db3e4bcd40abb0ec89629.jpg"],
            is_active=True
        )
        loreal_men_cologne.generate_slug()
        loreal_men_cologne.categories.extend([loreal, men_fragrance, fresh_m, clearance_items])
        db.session.add(loreal_men_cologne)

        fenty_unisex_fragrance = Product(
            name="Fenty Eau de Parfum",
            description="Citrus unisex fragrance by Fenty",
            price=1350.00,
            stock_quantity=12,
            sku="FENTY-FRG-001",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/1200x/19/09/af/1909afce3c699e9f5561f756e4444079.jpg","https://i.pinimg.com/736x/c5/fb/ae/c5fbaeaa3528689929a17594548777f4.jpg","https://i.pinimg.com/1200x/9f/e4/e3/9fe4e3de0dc152592ea876ae83f11a6c.jpg"],
            is_active=True
        )
        fenty_unisex_fragrance.generate_slug()
        fenty_unisex_fragrance.categories.extend([fenty, unisex_fragrance, citrus_u])
        db.session.add(fenty_unisex_fragrance)

        loreal_dry_shampoo = Product(
            name="L’Oréal Elvive Dry Shampoo",
            description="Revitalizing shampoo for dry hair",
            price=1499.99,
            stock_quantity=40,
            sku="LOREAL-SHM-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/22/03/30/220330ab275ab4b09add2da06565c097.jpg","https://i.pinimg.com/736x/c1/63/c8/c163c8fe2687a0e9ca2dcd66143ef224.jpg","https://i.pinimg.com/736x/c8/b3/b5/c8b3b5e5094f1a10f80307da96b9473d.jpg"],
            is_active=True
        )
        loreal_dry_shampoo.generate_slug()
        loreal_dry_shampoo.categories.extend([loreal, shampoos, dry_hair])
        db.session.add(loreal_dry_shampoo)

        maybelline_hair_mask = Product(
            name="Maybelline Express Repair Mask",
            description="Deep conditioning hair mask",
            price=1199.99,
            stock_quantity=25,
            sku="MAYBELLINE-MSK-001",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/736x/61/4a/e9/614ae9a1201870ac2b5982eef16599e6.jpg","https://i.pinimg.com/736x/d9/ab/90/d9ab90f0843a859b536aa1a605dd3789.jpg","https://i.pinimg.com/736x/d1/31/84/d131849864bffdddabf5d324f6a48b4d.jpg"],
            is_active=True
        )
        maybelline_hair_mask.generate_slug()
        maybelline_hair_mask.categories.extend([maybelline, hair_treatments, hair_masks])
        db.session.add(maybelline_hair_mask)

        fenty_hair_spray = Product(
            name="Fenty Hold & Shine Spray",
            description="Strong hold hair spray",
            price=1200.00,
            stock_quantity=30,
            sku="FENTY-SPR-001",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/736x/ce/a3/ef/cea3ef58754078d68cf710cab7a786c6.jpg","https://i.pinimg.com/736x/46/3b/82/463b82d4055a4facb35bb40b3b13ea13.jpg"],
            is_active=True
        )
        fenty_hair_spray.generate_slug()
        fenty_hair_spray.categories.extend([fenty, hair_styling, hair_spray])
        db.session.add(fenty_hair_spray)

        estee_lauder_gel_cleanser = Product(
            name="Estée Lauder Perfectly Clean Gel",
            description="Refreshing gel cleanser",
            price=800.00,
            stock_quantity=20,
            sku="ESTEE-CLS-001",
            brand="Estée Lauder",
            image_urls=["https://i.pinimg.com/736x/ed/19/fd/ed19fd50864c6c458b3e7fcb513c5874.jpg","https://i.pinimg.com/736x/21/b0/49/21b049ce04b6d4e1d4c58de1432aef0f.jpg","https://i.pinimg.com/736x/8c/fd/67/8cfd678db3904227c52f65dbfeecba94.jpg"],
            is_active=True
        )
        estee_lauder_gel_cleanser.generate_slug()
        estee_lauder_gel_cleanser.categories.extend([estee_lauder, cleansers, gel_cleanser])
        db.session.add(estee_lauder_gel_cleanser)

        loreal_hyaluronic_serum = Product(
            name="L’Oréal Revitalift Serum",
            description="Hydrating hyaluronic acid serum",
            price=2400.99,
            discount_price=1990.99,
            stock_quantity=50,
            sku="LOREAL-SER-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/6d/b3/24/6db3241185d0644582e2e27f68c9c9f4.jpg","https://i.pinimg.com/736x/ca/b6/38/cab63800419019ff880fa871e8e8884c.jpg","https://i.pinimg.com/736x/45/2c/50/452c50d0b083ad82386cc93240d6ba47.jpg"],
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
            image_urls=["https://i.pinimg.com/736x/7e/17/d4/7e17d419ba8b33e38f4c20e6d5b2adf6.jpg","https://i.pinimg.com/736x/d8/1b/34/d81b34a25bfb1968fce664534e15ee22.jpg","https://i.pinimg.com/736x/29/fa/fe/29fafef004e3297b2b5983658c12c704.jpg"],
            is_active=True
        )
        chanel_sheet_mask.generate_slug()
        chanel_sheet_mask.categories.extend([chanel, masks, sheet_masks])
        db.session.add(chanel_sheet_mask)

        fenty_spf_50 = Product(
            name="Fenty Skin Hydra Vizor SPF 50",
            description="Lightweight SPF 50 sunscreen",
            price=1800.00,
            stock_quantity=1550.00,
            sku="FENTY-SPF-001",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/736x/fe/9c/a4/fe9ca423eec8941da81f08dcd0ee421c.jpg","https://i.pinimg.com/736x/71/ca/f4/71caf4169490fbdd32a30005dce805f0.jpg",""],
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
            image_urls=["https://i.pinimg.com/736x/ad/18/b1/ad18b1c1525592f31f1cc7898bd6dd8c.jpg","https://i.pinimg.com/736x/b3/bc/a9/b3bca9682ef9ee70e953ac71c882393e.jpg","https://i.pinimg.com/736x/8f/1c/d8/8f1cd822805bd360a741da772d61efa1.jpg"],
            is_active=True,
            is_featured=True
        )
        chanel_necklace.generate_slug()
        chanel_necklace.categories.extend([chanel, jewelry, necklaces])
        db.session.add(chanel_necklace)

        mac_makeup_brushes = Product(
            name="MAC Brush Set",
            description="Professional makeup brush set",
            price=400.00,
            discount_price=250.00,
            stock_quantity=10,
            sku="MAC-BRS-001",
            brand="MAC Cosmetics",
            image_urls=["https://i.pinimg.com/736x/fb/10/7e/fb107e0a8dfa69471bd34d45dcef5a80.jpg","https://i.pinimg.com/736x/1b/24/53/1b2453eb884e32a6ac44aa3f31a17e6a.jpg","https://i.pinimg.com/736x/07/22/80/072280409443c7312ad3931f5f460392.jpg"],
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
            image_urls=["https://i.pinimg.com/736x/8d/b2/ef/8db2ef72608e3cba961a2ae87fd2452e.jpg","https://i.pinimg.com/736x/3b/50/fb/3b50fbc10422df6e997a6701be66c62c.jpg","https://i.pinimg.com/736x/ff/41/1e/ff411e82126f8f72f0016a5220a3b933.jpg"],
            is_active=True
        )
        fenty_handbag.generate_slug()
        fenty_handbag.categories.extend([fenty, bags, handbags])
        db.session.add(fenty_handbag)

        # Additional Products
        # Makeup
        maybelline_eyeliner = Product(
            name="Maybelline Hyper Easy Eyeliner",
            description="Liquid eyeliner with precision tip by Maybelline",
            price=9.99,
            stock_quantity=60,
            sku="MAYBELLINE-EYE-002",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/736x/95/5b/45/955b453e2aace6181f963eae0a4af202.jpg","https://i.pinimg.com/736x/bf/6b/af/bf6bafe9bd6a1d21b8bda122f4ae0764.jpg","https://i.pinimg.com/736x/e2/5c/d2/e25cd2ce5aeedf489c299e28d4ed780b.jpg"],
            is_active=True
        )
        maybelline_eyeliner.generate_slug()
        maybelline_eyeliner.categories.extend([maybelline, eye_makeup, eyeliner])
        db.session.add(maybelline_eyeliner)

        loreal_blush = Product(
            name="L’Oréal True Match Blush",
            description="Natural glow blush by L’Oréal",
            price=240.99,
            discount_price=199.99,
            stock_quantity=45,
            sku="LOREAL-BLS-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/4b/f8/10/4bf810d71337f30c70dfd4ab8c64702a.jpg","https://i.pinimg.com/736x/2e/b7/37/2eb73734ab9add10600400c1e6cce77a.jpg","https://i.pinimg.com/736x/10/b6/b5/10b6b542a75b6f5434cae100fe54f976.jpg"],
            is_active=True,
            is_featured=True
        )
        loreal_blush.generate_slug()
        loreal_blush.categories.extend([loreal, face_makeup, blush, discounted_items])
        db.session.add(loreal_blush)

        fenty_lip_balm = Product(
            name="Fenty Skin Plush Puddin Lip Balm",
            description="Hydrating lip balm by Fenty Beauty",
            price=160.00,
            stock_quantity=30,
            sku="FENTY-LIP-002",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/736x/33/db/37/33db373a2b0cd707b3e6eb0ae87c3d47.jpg","https://i.pinimg.com/736x/62/82/57/6282576679e092ca0a29e547cd7e7f2a.jpg","https://i.pinimg.com/736x/03/ed/ec/03edec02d4b1dc95de2b04f443a7dd7a.jpg"],
            is_active=True
        )
        fenty_lip_balm.generate_slug()
        fenty_lip_balm.categories.extend([fenty, lip_makeup, lip_balm])
        db.session.add(fenty_lip_balm)

        chanel_setting_powder = Product(
            name="Chanel Poudre Universelle",
            description="Translucent setting powder by Chanel",
            price=520.00,
            stock_quantity=15,
            sku="CHANEL-PWD-001",
            brand="Chanel",
            image_urls=["https://i.pinimg.com/736x/4d/5e/7e/4d5e7ed86900e54ae7fd27022e653602.jpg","https://i.pinimg.com/736x/62/61/fa/6261fa5e8940427a28256b486a2309ff.jpg","https://i.pinimg.com/736x/bc/84/b3/bc84b35444f5da6254260dc1d00f58c5.jpg"],
            is_active=True
        )
        chanel_setting_powder.generate_slug()
        chanel_setting_powder.categories.extend([chanel, face_makeup, setting_powder])
        db.session.add(chanel_setting_powder)

        mac_brow_pencil = Product(
            name="MAC Veluxe Brow Pencil",
            description="Precision brow pencil by MAC",
            price=100.00,
            stock_quantity=25,
            sku="MAC-BRW-001",
            brand="MAC Cosmetics",
            image_urls=["https://i.pinimg.com/736x/2a/ff/ff/2affff4748dd67f5ff028631f99522b7.jpg","https://i.pinimg.com/736x/01/ca/54/01ca54dbdc293341a67ea2c03cbc171b.jpg","https://i.pinimg.com/1200x/50/a2/60/50a260029b02cb708afe5216ae4ca316.jpg"],
            is_active=True
        )
        mac_brow_pencil.generate_slug()
        mac_brow_pencil.categories.extend([mac, eye_makeup, brow_products])
        db.session.add(mac_brow_pencil)

        estee_lauder_lip_liner = Product(
            name="Estée Lauder Double Wear Lip Liner",
            description="Long-lasting lip liner by Estée Lauder",
            price=270.00,
            discount_price=120.00,
            stock_quantity=20,
            sku="ESTEE-LIP-001",
            brand="Estée Lauder",
            image_urls=["https://i.pinimg.com/736x/77/6b/d5/776bd5e26c2cb7004e614db8ad959333.jpg","https://i.pinimg.com/736x/8f/d2/67/8fd2670547542cb2d085e2771c7e2e46.jpg","https://i.pinimg.com/736x/3a/25/4b/3a254b1c081f9b5988c8faa029dd20d8.jpg"],
            is_active=True
        )
        estee_lauder_lip_liner.generate_slug()
        estee_lauder_lip_liner.categories.extend([estee_lauder, lip_makeup, lip_liner, clearance_items])
        db.session.add(estee_lauder_lip_liner)

        # Fragrance
        estee_lauder_fruity_perfume = Product(
            name="Estée Lauder Beautiful Belle",
            description="Fruity floral perfume for women by Estée Lauder",
            price=959.59,
            stock_quantity=49.15,
            sku="ESTEE-PRF-001",
            brand="Estée Lauder",
            image_urls=["https://i.pinimg.com/736x/1b/1e/a3/1b1ea318ddcfef9e7c44739a85b3015d.jpg","https://i.pinimg.com/736x/3d/d8/9f/3dd89fe4d80bbf56a1cf1408ee19e5d0.jpg","https://i.pinimg.com/736x/ea/de/4a/eade4a40aedbd3c016cec2485d187483.jpg"],
            is_active=True,
            is_featured=True
        )
        estee_lauder_fruity_perfume.generate_slug()
        estee_lauder_fruity_perfume.categories.extend([estee_lauder, women_fragrance, fruity_w])
        db.session.add(estee_lauder_fruity_perfume)

        mac_woody_cologne = Product(
            name="MAC Shade Woody Cologne",
            description="Rich woody cologne for men by MAC",
            price=1899.49,
            stock_quantity=18,
            sku="MAC-COL-001",
            brand="MAC Cosmetics",
            image_urls=["https://dimg.dillards.com/is/image/DillardsZoom/mainProduct/mac-shadescents-crme-dnude-eau-de-parfum/05011609_zi.jpg","https://www.ashleybrookenicholas.com/wp-content/uploads/2016/12/mac-shadescents-perfume-lipstick-collection-candy-yum-yum-7121.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlJ7SHZDHgH4Q1ZLq4SaR_xnDSKHknrALyMT5FtFsV5Gr8fdko-NS81OEYwM-N8fAFrvI&usqp=CAU"],
            is_active=True
        )
        mac_woody_cologne.generate_slug()
        mac_woody_cologne.categories.extend([mac, men_fragrance, woody_m])
        db.session.add(mac_woody_cologne)

        maybelline_unisex_fragrance = Product(
            name="Maybelline Fresh Breeze",
            description="Citrus unisex fragrance by Maybelline",
            price=4000.00,
            discount_price=320.00,
            stock_quantity=25,
            sku="MAYBELLINE-FRG-001",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/736x/37/7e/be/377ebeed05569d8c836966187c6eae14.jpg","https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/22281864/2023/3/30/f9c1eeba-1890-4b6e-9867-c115e55c18751680169749619MaybellineNewYorkFitMeSetofFreshTintFoundation-Shade5Blush-H1.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiQ3hQO_QoBUzol5XVJHVb9yd_m9JQrW-m2o4LhtMaBns3kFvnWfFzSN8YAActYEAZ8Pk&usqp=CAU"],
            is_active=True
        )
        maybelline_unisex_fragrance.generate_slug()
        maybelline_unisex_fragrance.categories.extend([maybelline, unisex_fragrance, citrus_u, discounted_items])
        db.session.add(maybelline_unisex_fragrance)

        # Haircare
        chanel_hydrating_conditioner = Product(
            name="Chanel Coco Nourish Conditioner",
            description="Hydrating conditioner for all hair types",
            price=480.00,
            stock_quantity=60,
            sku="CHANEL-CND-001",
            brand="Chanel",
            image_urls=["https://i.pinimg.com/1200x/59/ea/e4/59eae4fc1634c0dcac61db0ce14cb3c5.jpg"],
            is_active=True
        )
        chanel_hydrating_conditioner.generate_slug()
        chanel_hydrating_conditioner.categories.extend([chanel, conditioners, hydrating_cond])
        db.session.add(chanel_hydrating_conditioner)

        estee_lauder_curly_shampoo = Product(
            name="Estée Lauder Curl Perfect Shampoo",
            description="Shampoo for curly hair by Estée Lauder",
            price=1300.00,
            stock_quantity=250,
            sku="ESTEE-SHM-001",
            brand="Estée Lauder",
            image_urls=["https://esteelauderhair.com/wp-content/uploads/2024/10/2147483648_-210041-1.jpg","https://esteelauderhair.com/wp-content/uploads/2024/10/2147483648_-210063-1.jpg","https://esteelauderhair.com/wp-content/uploads/2024/10/2147483648_-210055.jpg"],
            is_active=True
        )
        estee_lauder_curly_shampoo.generate_slug()
        estee_lauder_curly_shampoo.categories.extend([estee_lauder, shampoos, curly_hair])
        db.session.add(estee_lauder_curly_shampoo)

        mac_hair_oil = Product(
            name="MAC Smooth Shine Oil",
            description="Nourishing hair oil by MAC",
            price=500.00,
            discount_price=450.00,
            stock_quantity=15,
            sku="MAC-OIL-001",
            brand="MAC Cosmetics",
            image_urls=["https://i.pinimg.com/736x/b1/09/37/b10937d9507e951173a22480cb733a16.jpg","https://i.pinimg.com/736x/db/17/e1/db17e15745030da8a4a599903ee9026c.jpg","https://i.pinimg.com/736x/7d/e7/42/7de742be4edf9c2c4998a47f3c7b8000.jpg"],
            is_active=True
        )
        mac_hair_oil.generate_slug()
        mac_hair_oil.categories.extend([mac, hair_treatments, oils, clearance_items])
        db.session.add(mac_hair_oil)

        # Skincare
        maybelline_day_cream = Product(
            name="Maybelline Dream Fresh Day Cream",
            description="Lightweight day cream by Maybelline",
            price=1549.99,
            stock_quantity=40,
            sku="MAYBELLINE-CRM-001",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/736x/5f/67/c7/5f67c7e0e530141669ae99ddd64b71d9.jpg","https://i.pinimg.com/736x/05/e1/fe/05e1fea2594c50a0fc2a4da405c7b122.jpg"],
            is_active=True
        )
        maybelline_day_cream.generate_slug()
        maybelline_day_cream.categories.extend([maybelline, moisturizers, day_cream])
        db.session.add(maybelline_day_cream)

        fenty_clay_mask = Product(
            name="Fenty Skin Cookies N Clean Mask",
            description="Purifying clay mask by Fenty Beauty",
            price=320.00,
            stock_quantity=20,
            sku="FENTY-MSK-002",
            brand="Fenty Beauty",
            image_urls=["https://i.pinimg.com/736x/45/27/46/45274613b17f943619e792f830ef3ba1.jpg","https://i.pinimg.com/736x/37/f1/cf/37f1cf2c87a7e8b275bc2cbe60b0a038.jpg","https://i.pinimg.com/736x/02/0f/68/020f6897b6aabd42765ff8f224133e59.jpg"],
            is_active=True
        )
        fenty_clay_mask.generate_slug()
        fenty_clay_mask.categories.extend([fenty, masks, clay_masks])
        db.session.add(fenty_clay_mask)

        loreal_night_cream = Product(
            name="L’Oréal Age Perfect Night Cream",
            description="Anti-aging night cream by L’Oréal",
            price=2999.99,
            discount_price=2549.99,
            stock_quantity=30,
            sku="LOREAL-CRM-001",
            brand="L’Oréal",
            image_urls=["https://i.pinimg.com/736x/50/73/9c/50739cc23ae7ec0ea640a17413219455.jpg","https://i.pinimg.com/736x/22/f4/4c/22f44cf9105aaf0c6d34892e45258168.jpg","https://i.pinimg.com/736x/17/ea/16/17ea16508e364ad14fda3f7f6d3a697b.jpg"],
            is_active=True,
            is_featured=True
        )
        loreal_night_cream.generate_slug()
        loreal_night_cream.categories.extend([loreal, moisturizers, night_cream, discounted_items])
        db.session.add(loreal_night_cream)

        # Accessories
        estee_lauder_earrings = Product(
            name="Estée Lauder Gold Hoop Earrings",
            description="Elegant gold hoop earrings",
            price=250.00,
            stock_quantity=10,
            sku="ESTEE-ERR-001",
            brand="Estée Lauder",
            image_urls=["https://i.pinimg.com/736x/85/e7/b8/85e7b86d78f8094d13cf493cc3331274.jpg","https://i.pinimg.com/736x/0a/6d/d5/0a6dd5dbfe35ebaca065ec00b1ebb370.jpg","https://i.pinimg.com/736x/b0/2c/90/b02c90c7c106651cbb0b2a4388ccfc1f.jpg"],
            is_active=True,
            is_featured=True
        )
        estee_lauder_earrings.generate_slug()
        estee_lauder_earrings.categories.extend([estee_lauder, jewelry, earrings])
        db.session.add(estee_lauder_earrings)

        maybelline_crossbody_bag = Product(
            name="Maybelline Crossbody Bag",
            description="Chic crossbody bag by Maybelline",
            price=2000.00,
            discount_price=1750.00,
            stock_quantity=15,
            sku="MAYBELLINE-BAG-001",
            brand="Maybelline",
            image_urls=["https://i.pinimg.com/736x/9e/57/df/9e57df2f0cb66c8929c97a554bb3e030.jpg","https://i.pinimg.com/736x/9c/18/d2/9c18d2edbbfb083691c04d9a7ca9d697.jpg","https://i.pinimg.com/736x/f5/e9/00/f5e9001d21cea159df71841961b3ea40.jpg"],
            is_active=True
        )
        maybelline_crossbody_bag.generate_slug()
        maybelline_crossbody_bag.categories.extend([maybelline, bags, crossbody_bags, clearance_items])
        db.session.add(maybelline_crossbody_bag)

        chanel_hair_dryer = Product(
            name="Chanel Luxe Hair Dryer",
            description="High-performance hair dryer by Chanel",
            price=2500.00,
            stock_quantity=8,
            sku="CHANEL-DRY-001",
            brand="Chanel",
            image_urls=["https://i.ebayimg.com/images/g/k2IAAOSwiGhlOoGD/s-l1600.webp","https://i.ebayimg.com/images/g/rY8AAOSwxeNlOoGD/s-l1600.webp","https://i.ebayimg.com/images/g/VDcAAOSwNJZlOoGE/s-l140.webp"],
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
                email="test3@gmail.com",
                username="testuser3",
                role="CUSTOMER",
                is_active=True
            ),
            User(
                email="test4@gmail.com",
                username="testuser4",
                role="CUSTOMER",
                is_active=True
            )
        ]
        users[0].set_password('Password@123')
        users[1].set_password('Password@123!')
        users[2].set_password('Password@12')
        users[3].set_password('Password@12')

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
        cart = Cart(user_id=1)
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
        logger.info("Seeding test orders...")

        # Order 1: Completed M-Pesa order (standard shipping, delivered)
        order1 = Order(
            user_id=1,
            total=53.97,  # (2 * 12.99) + 12.99 + 10.99 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.COMPLETED.value,
            delivery_status=DeliveryStatus.DELIVERED.value,
            transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}",
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with M-Pesa payment',
            created_at=datetime.now(timezone.utc) - timedelta(days=10)  # ~2025-04-24
        )
        order1.update_order_status()  # Explicitly set order_status
        db.session.add(order1)
        db.session.flush()
        logger.debug(f"Order 1 created with order_status={order1.order_status}")

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

        # Order 2: Pending pay on delivery order (express shipping, pending)
        order2 = Order(
            user_id=1,
            total=90.99,  # 36.00 + 30.00 + 9.99 + 15.00 (shipping)
            shipping_cost=15.00,
            payment_status=PaymentStatus.PENDING.value,
            delivery_status=DeliveryStatus.PENDING.value,
            shipping_method='express',
            payment_method='pay_on_delivery',
            description='Test order with pay on delivery',
            created_at=datetime.now(timezone.utc) - timedelta(days=5)  # ~2025-04-29
        )
        order2.update_order_status()
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

        # Order 3: Failed M-Pesa order (standard shipping, pending)
        order3 = Order(
            user_id=1,
            total=159.98,  # 120.00 + 24.99 + 9.99 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.FAILED.value,
            delivery_status=DeliveryStatus.PENDING.value,
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with failed M-Pesa payment',
            created_at=datetime.now(timezone.utc) - timedelta(days=3)  # ~2025-05-01
        )
        order3.update_order_status()
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

        # Order 4: Initiated M-Pesa order (standard shipping, shipped)
        order4 = Order(
            user_id=3,
            total=84.98,  # 19.99 + 60.00 + 5.00 (shipping)
            shipping_cost=5.00,
            payment_status=PaymentStatus.INITIATED.value,
            delivery_status=DeliveryStatus.SHIPPED.value,
            checkout_request_id=f"CHECKOUT-{uuid.uuid4().hex[:8].upper()}",
            shipping_method='standard',
            payment_method='mpesa',
            description='Test order with M-Pesa payment in progress',
            created_at=datetime.now(timezone.utc) - timedelta(days=1)  # ~2025-05-03
        )
        order4.update_order_status()
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
        logger.error(f"Error adding test orders: {str(e)}")
        db.session.rollback()
        raise

    try:
        # 8. Reviews
        logger.info("Seeding reviews...")
        reviews = [
            Review(
                product_id=loreal_lipstick.id,
                user_id=3,
                rating=4,
                comment="Love the matte finish, stays on all day!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=2, month=4, year=2025)
            ),
            Review(
                product_id=loreal_lipstick.id,
                user_id=1,
                rating=3,
                comment="Nice color but a bit drying.",
                created_at=datetime.now(timezone.utc).replace(day=3, month=4, year=2025)
            ),
            Review(
                product_id=maybelline_foundation.id,
                user_id=2,
                rating=5,
                comment="Perfect match for my skin tone, great coverage!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=4, month=4, year=2025)
            ),
            Review(
                product_id=fenty_highlighter.id,
                user_id=1,
                rating=4,
                comment="Gives a beautiful glow, but a bit pricey.",
                created_at=datetime.now(timezone.utc).replace(day=5, month=4, year=2025)
            ),
            Review(
                product_id=chanel_floral_perfume.id,
                user_id=2,
                rating=5,
                comment="Amazing scent, feels so luxurious!",
                is_featured=True,
                created_at=datetime.now(timezone.utc).replace(day=6, month=4, year=2025)
            ),
            Review(
                product_id=loreal_hyaluronic_serum.id,
                user_id=3,
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