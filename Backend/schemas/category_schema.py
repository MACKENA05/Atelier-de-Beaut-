from marshmallow import Schema, fields, post_load
from models.category import Category

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    slug = fields.Str(dump_only=True)
    description = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True)
    is_featured = fields.Boolean(dump_only=True)
    display_order = fields.Int(dump_only=True)
    parent_id = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    children = fields.List(fields.Nested(lambda: CategorySchema()), dump_only=True)

    @post_load
    def make_category(self, data, **kwargs):
        return Category(**data)