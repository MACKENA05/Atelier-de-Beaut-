from mpesa_gateway import MpesaGateway
import json

if __name__ == "__main__":
    try:
        mpesa = MpesaGateway()
        response = mpesa.stk_push(
            phone="254704626801",
            amount=1,
            account_reference="Test123",
            description="Test Payment"
        )
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"Failed to initiate payment: {e}")