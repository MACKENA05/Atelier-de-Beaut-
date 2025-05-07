from marshmallow import Schema, fields, validates, ValidationError, post_dump
import json

class CartItemSchema(Schema):
    id = fields.Int(attribute="product_id")
    name = fields.Str(attribute="product.name")
    price = fields.Float(attribute="product.current_price")
    discount_percentage = fields.Float(attribute="product.discount_percentage")
    quantity = fields.Int()
    total = fields.Float(dump_only=True)
    image_url = fields.Method("get_image_url", dump_only=True)

    def get_image_url(self, obj):
        if not obj.product or not obj.product.image_urls:
            return None

        image_urls = obj.product.image_urls
        first_url = None

        # Handle case where image_urls is a JSON string
        if isinstance(image_urls, str):
            try:
                parsed_urls = json.loads(image_urls)
                if isinstance(parsed_urls, list) and parsed_urls:
                    first_url = parsed_urls[0]
            except json.JSONDecodeError:
                return None
        # Handle case where image_urls is already a list
        elif isinstance(image_urls, list) and image_urls:
            first_url = image_urls[0]

        if not first_url:
            return None

        # Optionally prepend the backend base URL (uncomment if needed)
        # base_url = "http://localhost:5000"  # Adjust based on your server
        # if first_url.startswith('/'):
        #     return f"{base_url}{first_url}"
        return first_url

    @post_dump
    def compute_fields(self, data, **kwargs):
        """Compute total during serialization."""
        obj = self.context.get('object')
        if obj:
            data['total'] = obj.quantity * obj.product.current_price
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