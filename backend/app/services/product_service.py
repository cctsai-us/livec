"""
Product service - business logic for product management
"""

class ProductService:
    async def list_products(self, skip: int = 0, limit: int = 20):
        """List products with pagination"""
        pass

    async def get_product(self, product_id: int):
        """Get product by ID"""
        pass

    async def create_product(self, seller_id: int, product_data: dict):
        """Create new product"""
        pass

    async def update_product(self, product_id: int, product_data: dict):
        """Update product"""
        pass

    async def delete_product(self, product_id: int):
        """Delete product"""
        pass
