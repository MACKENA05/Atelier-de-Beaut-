from marshmallow import Schema, fields, validates, ValidationError
from schemas.category_schema import CategorySchema

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
    brand = fields.Str(allow_none=True, validate=lambda x: len(x) <= 100 if x else True)
    image_urls = fields.List(fields.Str, allow_none=True)
    is_active = fields.Boolean(missing=True)
    is_featured = fields.Boolean(missing=False)
    average_rating = fields.Float(dump_only=True)
    review_count = fields.Int(dump_only=True)
    category_ids = fields.List(fields.Int, allow_none=True)
    categories = fields.Nested(CategorySchema, many=True, dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('brand')
    def validate_brand(self, value):
        if value and not value.strip():
            raise ValidationError("Brand name cannot be empty or whitespace")
        if value and len(value) > 100:
            raise ValidationError("Brand name cannot exceed 100 characters")

    @validates('sku')
    def validate_sku(self, value):
        if value and not value.strip():
            raise ValidationError("SKU cannot be empty or whitespace")
        if value and len(value) > 100:
            raise ValidationError("SKU cannot exceed 100 characters")
  