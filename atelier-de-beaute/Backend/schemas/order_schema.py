from marshmallow import Schema, fields, validates, ValidationError
from models.order import PaymentStatus, DeliveryStatus

class AddressSchema(Schema):
    full_name = fields.Str(required=True)
    phone = fields.Str(required=True)
    postal_address = fields.Str(required=True)
    city = fields.Str(required=True)
    country = fields.Str(required=True)
    cod_phone = fields.Str(required=False, allow_none=True)  # Optional for pay_on_delivery

class OrderItemSchema(Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True)
    unit_price = fields.Float(required=True)

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    total = fields.Float(dump_only=True)
    shipping_cost = fields.Float(dump_only=True)
    payment_status = fields.Str(dump_only=True)
    delivery_status = fields.Str(dump_only=True)
    transaction_id = fields.Str(dump_only=True, allow_none=True)
    checkout_request_id = fields.Str(dump_only=True, allow_none=True)
    shipping_method = fields.Str(required=True)
    payment_method = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    items = fields.List(fields.Nested(OrderItemSchema), dump_only=True)
    address = fields.Nested(AddressSchema, required=True)

    @validates('shipping_method')
    def validate_shipping_method(self, value):
        if value not in ['standard', 'express']:
            raise ValidationError("Invalid shipping method")

    @validates('payment_method')
    def validate_payment_method(self, value):
        if value not in ['mpesa', 'pay_on_delivery']:
            raise ValidationError("Payment method must be 'mpesa' or 'pay_on_delivery'")

class InvoiceSchema(Schema):
    order_id = fields.Int(dump_only=True)
    invoice_number = fields.Str(dump_only=True)
    total = fields.Float(dump_only=True)
    shipping_cost = fields.Float(dump_only=True)
    payment_status = fields.Str(dump_only=True)
    transaction_id = fields.Str(dump_only=True, allow_none=True)
    checkout_request_id = fields.Str(dump_only=True, allow_none=True)
    items = fields.List(fields.Nested(OrderItemSchema), dump_only=True)
    address = fields.Nested(AddressSchema, dump_only=True)
    issued_at = fields.DateTime(dump_only=True)