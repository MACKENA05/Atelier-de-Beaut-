from marshmallow import Schema, fields, post_load
from models.product import Product

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    slug = fields.Str(dump_only=True)
    description = fields.Str(allow_none=True)
    price = fields.Float(required=True)
    discount_price = fields.Float(allow_none=True)
    current_price = fields.Float(dump_only=True)
    discount_percentage = fields.Float(dump_only=True)
    stock_quantity = fields.Int(allow_none=True)
    sku = fields.Str(allow_none=True)
    brand = fields.Str(allow_none=True)
    image_urls = fields.List(fields.Str, allow_none=True)
    is_active = fields.Boolean(dump_only=True)
    is_featured = fields.Boolean(dump_only=True)
    average_rating = fields.Float(dump_only=True)
    review_count = fields.Int(dump_only=True)
    category_ids = fields.List(fields.Int, dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @post_load
    def make_product(self, data, **kwargs):
        return Product(**data)