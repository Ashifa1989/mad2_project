from  flask_restful import Api, Resource, abort, fields, marshal_with, reqparse
from model import db, User as user_model, Role, Category, Product, Cart, Order, Order_item, Roles_users
from flask_security import   login_user
from flask import make_response
from flask_security.utils import hash_password, verify_password 
from werkzeug.exceptions import HTTPException
import json
from datetime import datetime


api = Api(prefix="/api")

output_user_field = {
    "username" : fields.String,
    # "email" : fields.String,
    # "password" : fields.String,
    # "id": fields.Integer
}

output_Category_field = {
    "category_id" : fields.Integer,
    "category_name" : fields.String,
    "imagelink" : fields.String,
}

output_product_field = {
    "product_id" : fields.Integer,
    "product_name" : fields.String,
    "Description" : fields.String,
    "Catagory_id" : fields.Integer,
    "price_per_unit" : fields.Integer,
    "Stock" : fields.Integer,
    "image_url" : fields.String,
    "manufacture_date" : fields.String,
    "expairy_date" : fields.String,
    # "timestamp" : fields.DateTime

}
output_cart_field = {
    "product_id" : fields.Integer,
    "user_id" : fields.Integer,
    "cart_id" : fields.Integer,
    "product_name" : fields.String,
    "Description" : fields.String,
    "price_per_unit" : fields.Integer,
    "image_url" : fields.String,
    "quantity" : fields.Integer
}



user_register_parser = reqparse.RequestParser()  # Create a RequestParser object
user_register_parser.add_argument('username')     # Define the expected arguments
user_register_parser.add_argument('password')
user_register_parser.add_argument('email')
user_register_parser.add_argument("fs_uniquifier")

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('username')
update_user_parser.add_argument('password')
update_user_parser.add_argument('email')
update_user_parser.add_argument("category_id")

add_category_parser = reqparse.RequestParser()
add_category_parser.add_argument("category_name")
add_category_parser.add_argument("imagelink")
add_category_parser.add_argument("category_id")

update_category_parser = reqparse.RequestParser()
update_category_parser.add_argument("category_name")
update_category_parser.add_argument("imagelink")
update_category_parser.add_argument("category_id")

add_product_parser = reqparse.RequestParser()
add_product_parser.add_argument("product_id")
add_product_parser.add_argument("product_name")
add_product_parser.add_argument("Description")
add_product_parser.add_argument("Catagory_id")
add_product_parser.add_argument("price_per_unit")
add_product_parser.add_argument("Stock")
add_product_parser.add_argument("image_url")
add_product_parser.add_argument("manufacture_date")
add_product_parser.add_argument("expairy_date")
# add_product_parser.add_argument("timestamp")

update_product_parser = reqparse.RequestParser()
update_product_parser.add_argument("product_id")
update_product_parser.add_argument("product_name")
update_product_parser.add_argument("Description")
update_product_parser.add_argument("Catagory_id")
update_product_parser.add_argument("price_per_unit")
update_product_parser.add_argument("Stock")
update_product_parser.add_argument("image_url")
update_product_parser.add_argument("manufacture_date")
update_product_parser.add_argument("expairy_date")
# update_product_parser.add_argument("timestamp")


search_parser = reqparse.RequestParser()  
search_parser.add_argument("search_word") 
search_parser.add_argument("category_name")
search_parser.add_argument("min_price")
search_parser.add_argument("max_price")
search_parser.add_argument("manufacture_date")
search_parser.add_argument("expairy_date")

cart_parser = reqparse.RequestParser()
cart_parser.add_argument("product_id")
cart_parser.add_argument("quantity")
cart_parser.add_argument("price_per_unit")
cart_parser.add_argument("user_id")
cart_parser.add_argument("cart_id")

class AlreadyExistsError(HTTPException):
    def __init__(self, status_code, error_message):
        data = {"error_message": error_message}
        self.response = make_response(json.dumps(data), status_code)

class SchemaValidationError(HTTPException):
    def __init__(self, status_code, error_message):
        data = {"error_message": error_message}
        self.response = make_response(json.dumps(data), status_code)

class Users(Resource):
    @marshal_with(output_user_field)
    def get(self):
        all_user=user_model.query.all()
        if all_user is None:
             raise SchemaValidationError(status_code="404", error_message="users not found")
        else:
            return all_user 
    def post(self):  #login user
        args = user_register_parser.parse_args()
        print(args)
        user_name = args.get("username", None)
        password = args.get("password",None)
        user=user_model.query.filter_by(username=user_name).first()
        if(user):
        
            success = verify_password (password=password, password_hash=user.password)
                
            if (success):
                login_user(user)
                token = user.get_auth_token()
                return {'username': user_name, 'id' : user.id, 'token': token}, 200 
            # else:
            #     return { "error_message" : "Invalid password"}           
        else:
             raise SchemaValidationError(status_code=404, error_message="Invalid username or password")
            # return { "error_message" :"Invalid username "}

class UserApi(Resource):

    @marshal_with(output_user_field)
    def get(self,id):
        user=user_model.query.filter_by(id=id).first()
        if user:
            return user
        else:
             raise SchemaValidationError(status_code=404, error_message="Invalid username or password")
            
    
    def post(self): #register
        args = user_register_parser.parse_args()
        print(args)
        user_name = args.get("username", None)
        password = args.get("password",None)
        email= args.get("email", None)

        user = user_model.query.filter_by(username = user_name).first()
        if user:
            raise AlreadyExistsError(
                status_code=409,  error_message="username  already exists")
        
        new_user = user_model()
        new_user.username =  user_name
        new_user.password = hash_password(password)
        new_user.email=email
        new_user.fs_uniquifier = user_name

        db.session.add(new_user)
        db.session.commit()

        #add customer role to the new registered user
        role = Role.query.filter_by(name = "Customer").first()
        role_user = Roles_users()
        role_user.user_id = new_user.id
        role_user.role_id = role.id

        db.session.add(role_user)
        db.session.commit()

        return ("Successfully created new user", 200)
   
    # @marshal_with(output_user_field)
    def put(self, id): #update user information
        user = user_model.query.filter_by(id = id).first()
        if user is None :
             raise SchemaValidationError(status_code=404, error_message="user not found")
        args = update_user_parser.parse_args()
        
        username = args.get("username", None)
        password = args.get("password", None)
        email= args.get("email", None)
        if username is not None:
            user.username = username

        if password is not None:
            user.password = hash_password(password)
        if email is not None:
            user.email = email
        db.session.commit()
        return ("Successfully update the user", 200)
    
    # @marshal_with(output_user_field)
    def delete(self, id):
        user = user_model.query.filter_by(id=id).first()
        if user is None :
             raise SchemaValidationError(status_code=404, error_message="user not found")
        
        db.session.delete(user)
        db.session.commit()
        return ("successfully deleted the user", 200)
    
class manager_api(Resource):
    def post(self):
        args = user_register_parser.parse_args()
        print(args)
        user_name = args.get("username", None)
        password = args.get("password",None)
        email= args.get("email", None)
        user = user_model.query.filter_by(username = user_name).first()
        if user:
            raise AlreadyExistsError(
                status_code=409,  error_message="username  already exists")
        
        new_user = user_model(username = user_name, password = hash_password(password), email=email, fs_uniquifier = user_name, roles="Manager")
        " what to fill here for manger to get approval from admin"

        db.session.add(new_user)
        db.session.commit()
        return ("Successfully created new user", 200)


class Categories(Resource):
    @marshal_with(output_Category_field)
    def get(self):
        all_category= Category.query.all()
        return all_category
    
    # @marshal_with(output_Category_field)
    def post(self):
        args= add_category_parser.parse_args()
        category_name = args.get("category_name", None)
        image = args.get("imagelink", None)
        category =  Category.query.filter_by(category_name=category_name).first()
        if category:
            raise AlreadyExistsError(
                status_code=409,  error_message="category  already exists")
        new_category=Category(category_name=category_name, imagelink=image)
        db.session.add(new_category)
        db.session.commit()
        return ("Successfully created new category", 200)

    
class CategoryApi(Resource):
    
    @marshal_with(output_Category_field)
    def get(self, id):
        category =  Category.query.filter_by(category_id=id).first()
        
        
        if  category is None:
            raise SchemaValidationError(status_code=404, error_message="category not found ")
        else:
             return category
    
    @marshal_with(output_Category_field)
    def put(self, id):
        category =  Category.query.filter_by(category_id=id).first()
        args=update_category_parser.parse_args()
        category_name = args.get("category_name", None)
        image = args.get("imagelink", None)
        
        category.category_name = category_name
        category.imagelink = image
        db.session.commit()
        return category
    
    def delete(self, id):
        category =  Category.query.filter_by(category_id=id).first()
        if category is None:
            raise SchemaValidationError(status_code=404, error_message="category not found")
        db.session.delete(category)
        db.session.commit()
        return ("Successfully deleted the category", 200)
    
class products(Resource):
    @marshal_with(output_product_field)
    def get(self):
        # product = Product.query.filter_by(product_id=id).first()
        product = Product.query.order_by(Product.timestamp.desc()).all()  # Sort by timestamp
        
        return product

    # @marshal_with(output_product_field)
    def post(self):
        args=add_product_parser.parse_args()
       
        name = args.get("product_name", None)
        Description = args.get("Description", None)
        Catagory_id = args.get("Catagory_id", None)
        price_per_unit = args.get("price_per_unit", None )
        Stock = args.get("Stock", None)
        image_url = args.get("image_url", None)
        manufacture_date = args.get("manufacture_date", None)
        expairy_date = args.get("expairy_date", None)
        # timestamp = args.get("timestamp", None)
        product = Product.query.filter_by(product_name=name).first()
        if product:
             raise AlreadyExistsError(status_code=409,  error_message="Product name already exists")
        
        new_product = Product(product_name=name, Description=Description, 
                              Catagory_id=Catagory_id, price_per_unit=price_per_unit,
                              Stock=Stock, image_url=image_url, manufacture_date=manufacture_date,
                              expairy_date=expairy_date, timestamp=datetime.now())
        
        db.session.add(new_product)
        db.session.commit()
        return ("Successfully created the product", 200)
    


class Product_Api(Resource):
     
    @marshal_with(output_product_field)
    def get(self, category_name): #get all the product related to pairticular category
        # product = Product.query.filter_by(Catagory_id=Catagory_id).all()
        # product = Product.query.join(Category).filter(category.category_name=category_name)
        product = db.session.query(Product).join(Category).filter(Category.category_name == category_name).all()
        print(product)
        if product is []:
             raise SchemaValidationError(status_code=404, error_message="product not found")
        return product

    
    # @marshal_with(output_product_field)
    def put(self, id):
        update_product= Product.query.filter_by(product_id=id).first()
        if update_product is None:
             raise SchemaValidationError(status_code=404, error_message="product not found")
        args=update_product_parser.parse_args()
       
        
        name = args.get("product_name", None)
        Description = args.get("Description", None)
        Catagory_id = args.get("Catagory_id", None)
        price_per_unit = args.get("price_per_unit", None )
        Stock = args.get("Stock", None)
        image_url = args.get("image_url", None)
        manufacture_date = args.get("manufacture_date", None)
        expairy_date = args.get("expairy_date", None)

        
        update_product.product_name = name
        update_product.Description = Description
        update_product.Catagory_id = Catagory_id
        update_product.price_per_unit = price_per_unit
        update_product.Stock = Stock
        update_product.image_url = image_url
        update_product.manufacture_date = manufacture_date
        update_product.expairy_date = expairy_date
        db.session.commit()
        return ("Successfully update_product", 200)
    

    
    def delete(self, id):
        product= Product.query.filter_by(product_id=id).first()
        if product is None:
            raise SchemaValidationError(status_code=404, error_message="product not found")
        db.session.delete(product)
        db.session.commit()
        return ("Successfully deleted the product", 200)
    
class search_product(Resource):
    @marshal_with(output_product_field)
    def post(self):
        
        args=search_parser.parse_args()
        # print(args)
        search_word=args.get("search_word", None)
        category_name = args.get('category_name')
        min_price = args.get('min_price')
        max_price = args.get('max_price')
        manufacture_date = args.get('manufacture_date')

        # Start with an empty query
        query = Product.query

        # Add filters based on query parameters
        if category_name:
            query = query.join(Category).filter(Category.category_name==category_name)
            print(query)
            
        if min_price:
            query = query.filter(Product.price_per_unit >= min_price)
        if max_price:
            query = query.filter(Product.price_per_unit <= max_price)
        if manufacture_date:
            query = query.filter(Product.manufacture_date == manufacture_date)
        if search_word:
            search = f"%{search_word}%"
            query= query.filter(Product.product_name.like(search))
            

        products = query.order_by(Product.timestamp.desc()).all()
        print(products)
        if products :
            return products
            
        else:
            
            raise SchemaValidationError(status_code=404, error_message="sorry! product not found")
            
        
        
class search_category(Resource):
    @marshal_with(output_Category_field)
    def post(self):
        
        args=search_parser.parse_args()
        search_word=args.get("search_word", None)
        print(search_word)
        
        if search_word:
            search = f"%{search_word}%"
            category= Category.query.filter(Category.category_name.like(search)).all()
            return category
        
class cart_Api(Resource):
    @marshal_with(output_cart_field)
    def get(self, user_id):
        cart=Cart.query.filter_by(user_id=user_id).join(Product).all()
        print(cart[0].user_id)
        if cart:
            return cart
        else:
            raise SchemaValidationError(status_code=404, error_message="There are no items in your cart ")
    
    # @marshal_with(output_cart_field)
    def post(self, user_id):
        arg = cart_parser.parse_args()
        product_id=arg.get("product_id", None)
        quantity = arg.get("quantity", 0)
        # user_id = arg.get("user_id", None)
        
        product=Product.query.filter_by(product_id=product_id).first()
        cart = Cart(product=product, quantity = quantity, user_id =user_id, price_per_unit = product.price_per_unit, total_price=(quantity*product.price_per_unit))
        
        
        db.session.add(cart)
        db.session.commit()
        
        return {"message": "Successfully added to the cart."}
    
    
    def delete(self, cart_id) :
        print(cart_id)
        cart=Cart.query.filter_by(cart_id=cart_id).first()
        
        if cart :
            
            db.session.delete(cart)
        
            db.session.commit()
            
            return ("successfully removed item from the cart", 200)
            
        else:
            raise SchemaValidationError(status_code=404, error_message="product not found in cart")
        
class Order_api(Resource):
    def post(self, user_id):
        # args= cart_parser.parse_args()
        # user_id = args.get("user_id", None)
        cart_items=Cart.query.filter_by(user_id=user_id).all()
        print(cart_items)
        if cart_items == []:
            raise SchemaValidationError(status_code=404, error_message="there is no item in cart ") 
        total_price=0
        for item in cart_items:
            total_price=total_price+item.total_price
        
    
        new_order = Order(user_id=user_id, total_price=total_price,  
                    order_date=datetime.now(),
                    payment_id=None,
                    address_id=None)
        db.session.add(new_order)
        db.session.commit()
        
        for cart_item in cart_items:
            order_item = Order_item(
                order_id=new_order.order_id,  
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price_per_unit=cart_item.price_per_unit,
                total_price=cart_item.total_price)
            db.session.add(order_item)
            db.session.delete(cart_item)  
        db.session.commit()
        return {"message": "Order placed successfully"}, 200


api.add_resource(Users, "/users","/users/login")
api.add_resource(UserApi, "/users/<int:id>", "/users/register")
api.add_resource(Categories, "/category")
api.add_resource(CategoryApi, "/category/<id>")
api.add_resource(products, "/product", "/product/<int:id>")
api.add_resource(search_category, "/category/search")
api.add_resource(Product_Api, "/product/<int:id>", "/product/category/<string:category_name>")
api.add_resource(search_product, "/product/search")
api.add_resource(cart_Api,  "/cart/<int:cart_id>", "/cart/user/<int:user_id>")
api.add_resource(Order_api, "/order/<int:user_id>")