from app import create_app, db
from models.product import Product
from models.user import User
from flask_jwt_extended import create_access_token
import unittest
class CartTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        user = User(email='test@example.com', id=1, username='testuser', role='user', password_hash='hash')
        db.session.add(user)
        db.session.commit()
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    def test_get_guest_cart(self):
        response = self.client.get('/api/cart/guest')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'items': [], 'total': 0})
    def test_add_to_guest_cart(self):
        product = Product(name='Test Product', slug='test-product', price=10.0, stock_quantity=100)
        db.session.add(product)
        db.session.commit()
        response = self.client.post('/api/cart/guest/add', json={'product_id': product.id, 'quantity': 2})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Item added to guest cart')
    def test_add_to_user_cart(self):
        product = Product(name='Test Product', slug='test-product', price=10.0, stock_quantity=100)
        db.session.add(product)
        db.session.commit()
        access_token = create_access_token(identity='test@example.com')
        response = self.client.post(
            '/api/cart/1/add',
            json={'product_id': product.id, 'quantity': 2},
            headers={'Authorization': f'Bearer {access_token}'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Item added to cart')
if __name__ == '__main__':
    unittest.main()