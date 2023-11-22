from model import Product, Category
from config import cache

@cache.cached(timeout=60, key_prefix="get_all_product")
def get_all_product():
  products = Product.query.order_by(Product.timestamp.desc()).all() 
  return products

@cache.cached(timeout=60, key_prefix="get_product_by_category")
def get_product_by_category(name):
  product=Product.query.join(Category).filter(Category.category_name==name)
  return product

@cache.cached(timeout=60, key_prefix="get_all_category")
def get_all_category():
  category = Category.query.all() 
  return category