from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()




    

class User(db.model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False) # for generating authentication token

    #relationship with other model
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy= 'dynamic'), cascade = "all, delete") #many to many relatioship btw user and role through user_roles
    cart= db.relationship("Cart", backref='user', cascade = "all, delete") # one to many relation btw user and cart
    order= db.relationship("Order", backref='user', cascade = "all, delete") # one to many relationship btw user and order
    Address = db.relationship('Address', backref='user', cascade = "all, delete") # one to many relation btw user and address
    payment = db.relationship('Payment', backref='user', cascade = "all, delete") # one to many relation between user and payment

class Role(db.model, RoleMixin):
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String, nullable=False)
    Description =db.Column(db.String)

class User_roles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'))


class Category(db.model):
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String, unique=True, nullable=False)
    imagelink = db.Column(db.Text, nullable=True)
    product = db.relationship('Product', backref='category', cascade = "all, delete") # one to many relation btw catogory and product

class Product(db.model):
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String, unique=True, nullable=False)
    Description = db.Column(db.Text)
    Catagory_id = db.Column(db.Integer, db.ForeignKey('category.category_id'))
    price_per_unit =  db.Column(db.Integer)
    Stock = db.Column(db.Integer)
    image_url = db.Column(db.Text, nullable=True)
    manufacture_date = db.Column(db.Date)
    expairy_date = db.Column(db.Date)

    promotions = db.relationship('Promotion', backref='product', cascade='all, delete') # one to many relationship btw product and promotion




class Cart(db.model):
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement= True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    price_per_unit =  db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Float)

    category = db.relationship("Category", backref='cart', cascade ='all, delete') #one to many relation btw cart and catogory
    product = db.relationship('Product', backref='cart', cascade = "all, delete") # one to many relation btw cart and product

class Order(db.model):
    order_id = db.Column(db.Integer, primary_key=True, autoincrement= True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    total_price = db.Column(db.Float)
    order_date = db.Column(db.DateTime)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.payment_id'))
    address_id =db.Column(db.Integer, db.ForeignKey('address.address_id'))

class Order_item(db.model):
    order_item_id = db.Column(db.Integer, primary_key= True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    price_per_unit =  db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Float)


class Payment(db.model):
     
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.userid'))
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'), nullable=False)
    amount = db.Column(db.Float)
    payment_date = db.Column(db.DateTime)
    

class Address(db.model):
    address_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    street = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    postal_code = db.Column(db.String)


class Promotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    discount_type = db.Column(db.String, nullable=False)  # 'percentage' or 'fixed_amount'
    discount_value = db.Column(db.Float, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))  

    
db.create_all()