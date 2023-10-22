from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime

db = SQLAlchemy()  
# Define models

# roles_users = db.Table('roles_users',
#         db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
#         db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class User(db.Model, UserMixin):
    # pass
    __tablename__ = "user"
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=True)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False) # for generating authentication token
    
    #relationship with other model 
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy= 'dynamic')) #many to many relatioship btw user and role through user_roles
    cart= db.relationship("Cart", backref='user', cascade = "all, delete") # one to many relation btw user and cart
    order= db.relationship("Order", backref='user', cascade = "all, delete") # one to many relationship btw user and order
    Address = db.relationship('Address', backref='user', cascade = "all, delete") # one to many relation btw user and address
    payment = db.relationship('Payment', backref='user', cascade = "all, delete") # one to many relation between user and payment

class Role(db.Model, RoleMixin):
    # pass
    __tablename__ = "role"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    description =db.Column(db.String)

class Roles_users(db.Model):
    __tablename__ = "roles_users"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class Category(db.Model):
    __tablename__ = "category"
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String, unique=True, nullable=False)
    imagelink = db.Column(db.Text, nullable=True)
    # cart_id = db.Column(db.Integer, db.ForeignKey('cart.cart_id'))
    product = db.relationship('Product', backref='category', cascade = "all, delete") # one to many relation btw catogory and product

class Product(db.Model):
    __tablename__ = "product"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String, unique=True, nullable=False)
    Description = db.Column(db.Text)
    Catagory_id = db.Column(db.Integer, db.ForeignKey('category.category_id'))
    price_per_unit =  db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    Stock = db.Column(db.Integer)
    image_url = db.Column(db.Text, nullable=True)
    manufacture_date = db.Column(db.String)
    expairy_date = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    promotions = db.relationship('Promotion', backref='product', cascade='all, delete') # one to many relationship btw product and promotion
    carts = db.relationship('Cart', backref='product')

class Cart(db.Model):
    __tablename__ = "cart"
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement= True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    price_per_unit =  db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Float)

    # category = db.relationship("Category", backref='cart', cascade ='all, delete') #one to many relation btw cart and catogory
     # one to many relation btw cart and product

class Order(db.Model):
    __tablename__ = "order" 
    order_id = db.Column(db.Integer, primary_key=True, autoincrement= True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    total_price = db.Column(db.Float)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.payment_id'))
    address_id =db.Column(db.Integer, db.ForeignKey('address.address_id'))

class Order_item(db.Model):
    __tablename__ = "order_item" 
    order_item_id = db.Column(db.Integer, primary_key= True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    price_per_unit =  db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Float)

class Payment(db.Model):
    __tablename__ = "payment"  
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    card_number =db.Column(db.Integer)
    cvv=db.Column(db.Integer)
    expiry_date = db.Column(db.Integer)
    
class Address(db.Model):
    __tablename__ = "address" 
    address_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    street = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    postal_code = db.Column(db.String)

class Promotion(db.Model):
    __tablename__ = "promotion" 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    discount_type = db.Column(db.String, nullable=False)  
    discount_value = db.Column(db.Float, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))