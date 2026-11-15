import unittest
from fastapi.testclient import TestClient
from main import app
class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
    def test_health(self):
        self.assertEqual(self.client.get("/health").json(), {"ok": True})
    def test_filters(self):
        self.assertEqual(len(self.client.get("/products?in_stock=true").json()["data"]), 2)
    def test_bad_parameters(self):
        self.assertEqual(self.client.get("/products?limit=500").status_code, 422)
        self.assertEqual(self.client.get("/products/nope").status_code, 422)
    def test_missing(self):
        self.assertEqual(self.client.get("/products/99").status_code, 404)
    def test_create(self):
        r = self.client.post("/products", json={"title": "Pen", "price": 3})
        self.assertEqual(r.status_code, 201)
        self.assertFalse(r.json()["persisted"])
        self.assertEqual(self.client.post("/products", json={"title": "Pen", "price": -1}).status_code, 422)
if __name__ == "__main__":
    unittest.main()
