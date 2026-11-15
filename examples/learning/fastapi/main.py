from typing import Annotated
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
app = FastAPI(title="Sukoaa FastAPI starter")
products = [{"id": 1, "title": "Notebook", "price": 12, "stock": 5}, {"id": 2, "title": "Lamp", "price": 35, "stock": 2}, {"id": 3, "title": "Bag", "price": 24, "stock": 0}]
class ProductInput(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    price: float = Field(gt=0)
@app.get("/health")
def health():
    return {"ok": True}
@app.get("/products")
def list_products(limit: Annotated[int, Query(ge=1, le=50)] = 10, in_stock: bool | None = None):
    rows = products if in_stock is None else [p for p in products if (p["stock"] > 0) == in_stock]
    return {"data": rows[:limit], "total": len(rows)}
@app.get("/products/{product_id}")
def get_product(product_id: int):
    product = next((p for p in products if p["id"] == product_id), None)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
@app.post("/products", status_code=201)
def create_product(product: ProductInput):
    return {"data": {"id": 4, **product.model_dump()}, "persisted": False}
