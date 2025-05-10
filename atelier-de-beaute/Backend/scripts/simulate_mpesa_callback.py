import requests
import json

def simulate_mpesa_callback(callback_url, checkout_request_id, result_code=0, result_desc="The service request is processed successfully."):
    callback_data = {
        "Body": {
            "stkCallback": {
                "ResultCode": result_code,
                "ResultDesc": result_desc,
                "CheckoutRequestID": checkout_request_id,
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 1000},
                        {"Name": "MpesaReceiptNumber", "Value": "SIMULATED12345"},
                        {"Name": "Balance"},
                        {"Name": "TransactionDate", "Value": 20230601123045},
                        {"Name": "PhoneNumber", "Value": 254700000000}
                    ]
                }
            }
        }
    }

    headers = {'Content-Type': 'application/json'}
    response = requests.post(callback_url, data=json.dumps(callback_data), headers=headers)
    print(f"Callback response status: {response.status_code}")
    print(f"Callback response body: {response.text}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python simulate_mpesa_callback.py <callback_url> <checkout_request_id> [result_code] [result_desc]")
        sys.exit(1)

    callback_url = sys.argv[1]
    checkout_request_id = sys.argv[2]
    result_code = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    result_desc = sys.argv[4] if len(sys.argv) > 4 else "The service request is processed successfully."

    simulate_mpesa_callback(callback_url, checkout_request_id, result_code, result_desc)
