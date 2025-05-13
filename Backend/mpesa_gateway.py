import base64
import datetime
import requests
import os
from flask import current_app
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class MpesaGateway:
    def __init__(self):
        # Validate environment variables
        required_env_vars = [
            'MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_PASS_KEY',
            'MPESA_BUSINESS_SHORTCODE', 'MPESA_CALLBACK_URL'
        ]
        for var in required_env_vars:
            if not os.getenv(var):
                logger.error(f"Missing required environment variable: {var}")
                raise ValueError(f"Environment variable {var} is not set")

        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.pass_key = os.getenv('MPESA_PASS_KEY')
        self.business_shortcode = os.getenv('MPESA_BUSINESS_SHORTCODE')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL')
        self.environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')

        # Set base URL based on environment
        self.base_url = (
            'https://sandbox.safaricom.co.ke' if self.environment == 'sandbox'
            else 'https://api.safaricom.co.ke'
        )

        try:
            self.access_token = self.authenticate()
        except Exception as e:
            logger.error(f"Failed to initialize MpesaGateway: {e}")
            raise

    def authenticate(self):
        """Get OAuth access token."""
        endpoint = f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials'
        try:
            response = requests.get(endpoint, auth=(self.consumer_key, self.consumer_secret), timeout=10)
            response.raise_for_status()
            data = response.json()
            access_token = data.get('access_token')
            if not access_token:
                logger.error("Access token not found in response")
                raise ValueError("Failed to retrieve access token")
            logger.info("Successfully authenticated with M-Pesa API")
            return access_token
        except requests.exceptions.RequestException as e:
            logger.error(f"Error during authentication: {e}")
            raise Exception(f"Authentication failed: {e}")

    def generate_password(self):
        """Generate Lipa Na M-Pesa Online Password."""
        timestamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M%S')
        data = f"{self.business_shortcode}{self.pass_key}{timestamp}"
        password = base64.b64encode(data.encode()).decode()
        return password, timestamp

    def stk_push(self, phone, amount, account_reference, description):
        """Initiate STK push payment request with retry on 500 errors using exponential backoff."""
        import time

        endpoint = f'{self.base_url}/mpesa/stkpush/v1/processrequest'
        max_retries = 2  # Reduced retries to 2 to avoid multiple concurrent requests
        base_retry_delay = 3  # Increased base delay to 3 seconds

        for attempt in range(1, max_retries + 1):
            try:
                password, timestamp = self.generate_password()
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'Content-Type': 'application/json'
                }
                # Round amount to integer for M-Pesa API
                rounded_amount = str(int(round(float(amount))))
                payload = {
                    "BusinessShortCode": self.business_shortcode,
                    "Password": password,
                    "Timestamp": timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": rounded_amount,
                    "PartyA": phone,
                    "PartyB": self.business_shortcode,
                    "PhoneNumber": phone,
                    "CallBackURL": self.callback_url,
                    "AccountReference": account_reference[:24],  # Truncate to 24 chars
                    "TransactionDesc": description[:20]  # Truncate to 20 chars
                }

                logger.info(f"Sending STK Push request to {phone}, attempt {attempt}: {payload}")
                response = requests.post(endpoint, json=payload, headers=headers, timeout=10)
                try:
                    response.raise_for_status()
                except requests.exceptions.HTTPError as e:
                    logger.error(f"HTTP Error on attempt {attempt}: {e}, Response: {response.text}")
                    if response.status_code == 500 and attempt < max_retries:
                        retry_delay = base_retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                        logger.info(f"Retrying STK Push request in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        continue
                    raise
                response_data = response.json()

                if response_data.get('ResponseCode') == '0':
                    logger.info(f"STK Push initiated successfully for {phone}: {response_data}")
                    return response_data
                else:
                    logger.error(f"STK Push failed for {phone}: {response_data}")
                    raise ValueError(f"STK Push failed: {response_data.get('ResponseDescription')}")
            except requests.exceptions.RequestException as e:
                logger.error(f"Error initiating STK Push for {phone} on attempt {attempt}: {e}")
                if attempt < max_retries:
                    retry_delay = base_retry_delay * (2 ** (attempt - 1))  # Exponential backoff
                    logger.info(f"Retrying STK Push request in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    continue
                raise Exception(f"STK Push request failed after {max_retries} attempts: {e}")
            except ValueError as e:
                logger.error(f"STK Push error for {phone}: {e}")
                raise
        # If all retries fail, raise an exception
        raise Exception(f"STK Push request failed after {max_retries} attempts")
