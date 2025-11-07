"""
Payment service - business logic for payment processing
"""

class PaymentService:
    async def create_payment(self, order_id: int, payment_method: str):
        """Create payment for order"""
        pass

    async def process_payment(self, payment_id: int):
        """Process payment with gateway"""
        pass

    async def verify_payment(self, payment_id: int, transaction_data: dict):
        """Verify payment from webhook"""
        pass

    async def handle_ecpay_callback(self, callback_data: dict):
        """Handle ECPay webhook (Taiwan)"""
        pass

    async def handle_omise_callback(self, callback_data: dict):
        """Handle Omise webhook (Thailand)"""
        pass
