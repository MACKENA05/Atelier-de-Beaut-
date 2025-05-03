from marshmallow import Schema, fields, validates, ValidationError, post_dump

class CartItemSchema(Schema):
    product_id = fields.Int()
    name = fields.Str(attribute="product.name")
    price = fields.Float(attribute="product.current_price")
    discount_percentage = fields.Float(attribute="product.discount_percentage")
    quantity = fields.Int()
    total = fields.Float(dump_only=True)
    image_url = fields.Str(dump_only=True)

    @post_dump
    def compute_fields(self, data, **kwargs):
        """Compute total and image_url during serialization."""
        obj = self.context.get('object')
        if obj:
            data['total'] = obj.quantity * obj.product.current_price
            data['image_url'] = obj.product.image_urls[0] if obj.product.image_urls else None
        return data

class CartSchema(Schema):
    items = fields.List(fields.Nested(CartItemSchema))
    total = fields.Float()

    @post_dump
    def ensure_float_total(self, data, **kwargs):
        """Ensure total is a float."""
        if 'total' in data:
            data['total'] = float(data['total'])
        return data

class CartAddRequestSchema(Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True)

    @validates('quantity')
    def validate_quantity(self, value):
        if value <= 0:
            raise ValidationError("Quantity must be greater than 0")

class CartUpdateRequestSchema(Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True)

    @validates('quantity')
    def validate_quantity(self, value):
        if value <= 0:
            raise ValidationError("Quantity must be greater than 0")