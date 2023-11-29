from application.model import Product, Category
from flask_caching import Cache

cache=Cache()
@cache.cached(timeout=60, key_prefix="get_all_product")
def get_all_product():
  products = Product.query.order_by(Product.timestamp.desc()).all() 
  return products


@cache.cached(timeout=60, key_prefix="get_all_category")
def get_all_category():
  category = Category.query.all() 
  return category