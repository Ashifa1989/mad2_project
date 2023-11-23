from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin , RoleMixin 
from flask_security.utils import hash_password
import uuid
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, Length
from datetime import date ,  datetime, timedelta

db=SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    permissions = db.Column(db.UnicodeText)

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True , nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    orders=db.relationship("Order", backref="user")

    def __init__(self, email, password,username,active,roles):
        self.username=username
        self.email = email
        self.active=active
        self.roles=roles
        self.password = password
        self.timestamp=datetime.now()
        self.fs_uniquifier = generate_random_uniquifier()

def generate_random_uniquifier():
    # Generate a unique value using UUID
    uniquifier = str(uuid.uuid4())
    return uniquifier

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    
class Category(db.Model):
    __tablename__ = "category"
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String, unique=True, nullable=False)
    imagelink = db.Column(db.Text, nullable=True)
    approve= db.Column(db.Boolean())
    updateRequest=db.Column(db.Boolean())
    deleteRequest=db.Column(db.Boolean())
    product = db.relationship('Product', backref='category',cascade ="all", lazy="subquery") # one to many relation btw catogory and product

class Product(db.Model):
    __tablename__ = "product"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String, unique=True, nullable=False)
    Description = db.Column(db.Text)
    Catagory_id = db.Column(db.Integer, db.ForeignKey('category.category_id'))
    price_per_unit =  db.Column(db.Float)
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
    price_per_unit = db.Column(db.Float)
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
    order_items =db.relationship('Order_item', backref='order')
    address=db.relationship("Address")
    payment=db.relationship("Payment")

class Order_item(db.Model):
    __tablename__ = "order_item" 
    order_item_id = db.Column(db.Integer, primary_key= True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    price_per_unit =  db.Column(db.Float)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Float)
    product=db.relationship('Product')

class Payment(db.Model):
    __tablename__ = "payment"  
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    type=db.Column(db.Integer)
    card_number =db.Column(db.Integer)
    cvv=db.Column(db.Integer)
    expiry_date = db.Column(db.String)
    
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