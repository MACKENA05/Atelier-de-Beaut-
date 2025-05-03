from marshmallow import Schema, fields, validate
from schemas.product_schema import ProductSchema
from schemas.user import UserResponseSchema

class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    product_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(allowing_none=True, validate=validate.Length(max=1000))
    created_at = fields.DateTime(dump_only=True, format='%Y-%m-%dT%H:%M:%SZ')
    updated_at = fields.DateTime(dump_only=True, format='%Y-%m-%dT%H:%M:%SZ')
    is_featured = fields.Boolean(dump_only=True)
    username = fields.Method('get_username', dump_only=True)
    product = fields.Nested(ProductSchema, dump_only=True)
    user = fields.Nested(UserResponseSchema, dump_only=True)

    def get_username(self, obj):
        return obj.user.username if obj.user else None


class ReviewsSchema(Schema):
    reviews = fields.List(fields.Nested(ReviewSchema))

class ProductWithReviewsSchema(ProductSchema):
    reviews = fields.List(fields.Nested(ReviewSchema, exclude=('product',)), dump_only=True)