from  flask_restful import Api, Resource,  fields, marshal_with, reqparse 
from application.model import db, User as user_model, Role, Category, Product, Cart, Order, Order_item, RolesUsers, Address,Payment
from flask_security  import   auth_required, roles_required, current_user, roles_accepted
from flask import make_response
from flask_security.utils import hash_password, verify_password 
from werkzeug.exceptions import HTTPException
import json
from datetime import datetime
from flask_mail import Mail, Message
from datetime import datetime, timedelta, date
import redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
from application.tasks import notify_manager_for_signup_Approval, notify_manager_for_signup_reject, new_category_approval_request
from application.tasks import *
from application.cachedata import get_all_product, get_all_category, cache
from time import perf_counter_ns
import logging

logger = logging.getLogger(__name__)


api = Api(prefix="/api")

output_user_field = {
    "username" : fields.String,

    "email" : fields.String,
    # "password" : fields.String,
    "id": fields.Integer, 
    "roles": fields.List(fields.Nested({
        "name": fields.String
    }))
    
}

output_Category_field = {
    "category_id" : fields.Integer,
    "category_name" : fields.String,
    "imagelink" : fields.String,
    "approve":fields.Boolean,
    "updateRequest":fields.Boolean,
    "deleteRequest":fields.Boolean
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
    "timestamp" : fields.DateTime,
    "quantity" : fields.String   #quantity unit
}

output_cart_field = {
    "product_id" : fields.Integer,
    "user_id" : fields.Integer,
    "cart_id" : fields.Integer,
    "price_per_unit" : fields.Float,
    "quantity" : fields.Integer, #number of item
    "total_price":fields.Float, 
    "Stock" : fields.Integer, 
    "product":fields.Nested({"product_name" : fields.String, "image_url" : fields.String,})
}

output_order_field={
    "address_id": fields.Integer,
    "payment_id" : fields.Integer,
    "order_id" : fields.Integer,
    "order_date":fields.DateTime,
    "user_id" : fields.Integer,
    "total_price":fields.Float,
    "address": fields.Nested ({"street" : fields.String, "city" : fields.String , "state" : fields.String , "postal_code" : fields.String}),
    "payment": fields.Nested ({"type": fields.String }),
    "order_items" : fields.List (fields.Nested({
    "product_id" : fields.Integer,
    "order_id":fields.Integer,
    "price_per_unit" : fields.Float,
    "quantity" : fields.Integer,
    "total_price":fields.Float,
    "product":fields.Nested({"product_name" : fields.String, "image_url" : fields.String,})}))
}

output_address_field={
    "address_id" : fields.Integer,
    "user_id" : fields.Integer,
    "username" : fields.String,
    "street" : fields.String,
    "state" : fields.String,
    "postal_code" : fields.String,
    "city":fields.String
}
output_payment_field={
    "user_id":fields.Integer,
    "payment_id":fields.Integer,
    "type":fields.String,
    "card_number" : fields.Integer,
    "cvv" :fields.Integer,
    "expiry_date" : fields.String,
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
add_product_parser.add_argument("timestamp")
add_product_parser.add_argument("quantity")

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
update_product_parser.add_argument("timestamp")
update_product_parser.add_argument("quantity")


search_parser = reqparse.RequestParser()  
search_parser.add_argument("search_word") 
search_parser.add_argument("category_name")
search_parser.add_argument("min_price")
search_parser.add_argument("max_price")
search_parser.add_argument("manufacture_date")
search_parser.add_argument("expairy_date")
search_parser.add_argument("quantity")

cart_parser = reqparse.RequestParser()
cart_parser.add_argument("product_id")
cart_parser.add_argument("quantity")
cart_parser.add_argument("price_per_unit")
cart_parser.add_argument("user_id")
cart_parser.add_argument("cart_id")


address_parser = reqparse.RequestParser()

address_parser.add_argument("username")
address_parser.add_argument("street")
address_parser.add_argument("city")
address_parser.add_argument("state")
address_parser.add_argument("postal_code")

payment_parser=reqparse.RequestParser()
payment_parser.add_argument("user_id")
payment_parser.add_argument("card_number")
payment_parser.add_argument("cvv")
payment_parser.add_argument("expiry_date")
payment_parser.add_argument("type")

order_parser=reqparse.RequestParser()
order_parser.add_argument("selectedaddress")
order_parser.add_argument("selectedpayment")

class AlreadyExistsError(HTTPException):
    def __init__(self, status_code, error_message):
        data = {"error_message": error_message}
        self.response = make_response(json.dumps(data), status_code)

class SchemaValidationError(HTTPException):
    def __init__(self, status_code, error_message):
        data = {"error_message": error_message}
        self.response = make_response(json.dumps(data), status_code)

class Users(Resource):
    @auth_required("token")    
    @marshal_with(output_user_field)
    def get(self):
        all_user=user_model.query.all()
        if all_user is None:
             raise SchemaValidationError(status_code="404", error_message="users not found")
        else:
            return all_user 
    

class UserApi(Resource):    
    @auth_required("token")
    @marshal_with(output_user_field)    
    def get(self):
        id = current_user.id
        
        user=user_model.query.filter_by(id=id).first()
        # print(user.roles[0])
        if user:
            return user
        else:
             raise SchemaValidationError(status_code=404, error_message="user not found")
            
    def post(self): #register
        args = user_register_parser.parse_args()
        # print(args)
        user_name = args.get("username", None)
        password = args.get("password",None)
        email= args.get("email", None)
        roles = Role.query.filter_by(name = "Customer").all()
        

        user = user_model.query.filter_by(username = user_name).first()
        if user:
            raise AlreadyExistsError(
                status_code=409,  error_message="Username  already exists")

        user = user_model.query.filter_by(email = email).first()
        if user:
            raise AlreadyExistsError(
                status_code=409,  error_message="Email already used")
        
        new_user = user_model(email, hash_password(password), user_name,True,  roles)

        db.session.add(new_user)
        db.session.commit()

        return ("Successfully created new user", 200)
    @auth_required("token")
    @marshal_with(output_user_field)
    def put(self): #update user information
        id=current_user.id
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
    def delete(self):
        id=current_user.id
        user = user_model.query.filter_by(id=id).first()
        if user is None :
             raise SchemaValidationError(status_code=404, error_message="user not found")
        
        db.session.delete(user)
        db.session.commit()
        return ("successfully deleted the user", 200)
    
class ManagerApi(Resource):
    def post(self):
        args = user_register_parser.parse_args()
        # print(args)
        user_name = args.get("username", None)
        password = args.get("password",None)
        email= args.get("email", None)
        user = user_model.query.filter_by(username = user_name).first()
        roles = Role.query.filter_by(name="Manager").all() + Role.query.filter_by(name="Customer").all()
        if user:
            raise AlreadyExistsError(
                status_code=409,  error_message="username  already exists")
        
        new_user = user_model(email, hash_password(password), user_name, False,  roles)

        db.session.add(new_user)
        db.session.commit()
        send_admin_approval_request()
        return {"message" :"Successfully created the acoount.please wait for the Admin approval"},200

class Categories(Resource):
    @auth_required("token")
    @marshal_with(output_Category_field)
    def get(self):
        logger.info("inside get all category using info")
        start=perf_counter_ns()
        all_category=get_all_category()
        end=perf_counter_ns()
        print("timetaken", end-start)
        logger.debug("inside get all category using degub")
        
        return all_category
    
    
    @auth_required("token")
    @roles_accepted("Admin", "Manager")
    def post(self):
        cache.clear()
        args= add_category_parser.parse_args()
        category_name = args.get("category_name", None)
        print(category_name)
        image = args.get("imagelink", None)
        
        category =  Category.query.filter_by(category_name=category_name).first()
    
        if category:
            raise AlreadyExistsError(
                status_code=409,  error_message="category  already exists")
        new_category=Category(category_name=category_name, imagelink=image, approve=True, updateRequest=False, deleteRequest=False )
        
        user_id=current_user.id
        user=user_model.query.filter_by(id=user_id).first()
        for  role in user.roles:
            print(role.name)
            if role=="Admin":
                db.session.add(new_category)
                db.session.commit()
                # return new_category
                return {"message":"Category created successfully."}, 200
            elif role=="Manager":
                new_category.approve=False
                db.session.add(new_category)
                db.session.commit()
                print(' i am before task call')
                new_category_approval_request()
                print("i am after task call")
                # return new_category
                return {"message":"Category creation initiated! Please await admin approval."}, 200
            
            else:
                return("you are not authorized to create new category")
    
class CategoryApi(Resource):
    @auth_required("token")
    @marshal_with(output_Category_field)
    def get(self, id):
        category =  Category.query.filter_by(category_id=id).first()
        
        
        if  category is None:
            raise SchemaValidationError(status_code=204, error_message="category not found ")
        else:
             return category
        
    @auth_required("token")
    @roles_accepted("Admin","Manager")
    def put(self, id):
        cache.clear()
        category =  Category.query.filter_by(category_id=id).first()
        args=update_category_parser.parse_args()
        category_name = args.get("category_name", None)
        image = args.get("imagelink", None)
        # print(args)
        # category.category_name = category_name
        # category.imagelink = image
        user_id=current_user.id
        user=user_model.query.filter_by(id=user_id).first()
        if category is not None :
            for role in user.roles:
                if role=="Admin":
                    category.category_name = category_name
                    category.imagelink = image
                    category.updateRequest=False
                    db.session.commit()
                    print(category)
                    # return category
                    return {"message":"Category updated successfully"}, 200
                elif role=="Manager" :
                    category.updateRequest=True
                    db.session.commit()

                    category.category_name = category_name
                    category.imagelink = image
                    redis_key=category.category_id
                    redis_value = {
                            'category_id': category.category_id,
                            'category_name': category.category_name,
                            'imagelink': category.imagelink
                        }

                    redis_client.set(redis_key, json.dumps(redis_value))
                    update_category_approval_request()
                    
                    # return category
                    return {"message":"Category updates initiated! Please await admin approval."}, 200
        else:
            raise SchemaValidationError(status_code=204, error_message="category not found")
        
        
    @auth_required("token")
    @roles_accepted("Admin","Manager")
    def delete(self, id):
        cache.clear()
        category =  Category.query.filter_by(category_id=id).first()
        user_id=current_user.id
        user=user_model.query.filter_by(id=user_id).first()
        print(user.roles)

        if category is not None :
            for role in user.roles:
                if role=="Admin":
                    category.deleteRequest=False
                    db.session.delete(category)
                    db.session.commit()
                    return {"message":"Category deleted successfully!"}, 200
                elif role=="Manager":
                    category.deleteRequest=True
                    db.session.commit()
                    delete_category_approval_request()
                    return {"message":"Category deletion initiated! Please await admin approval."}, 200
        else:
            raise SchemaValidationError(status_code=204, error_message="category not found")
        
        
        
    
class products(Resource):
    @auth_required("token")
    @marshal_with(output_product_field)
    def get(self):
        logger.info("inside get all product using info")
        start=perf_counter_ns()
        # product = Product.query.order_by(Product.timestamp.desc()).all()  # Sort by timestamp
        products=get_all_product()
        end=perf_counter_ns()
        print("timetaken", end-start)
        logger.debug("inside get all product using info")
        return products
    
    
    @auth_required("token")
    @roles_accepted("Admin","Manager")
    @marshal_with(output_product_field)
    def post(self):
        cache.clear()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        args=add_product_parser.parse_args()
       
        name = args.get("product_name", None)
        Description = args.get("Description", None)
        Catagory_id = args.get("Catagory_id", None)
        price_per_unit = args.get("price_per_unit", None )
        Stock = args.get("Stock", None)
        image_url = args.get("image_url", None)
        manufacture_date = args.get("manufacture_date", None)
        expairy_date = args.get("expairy_date", None)
        unit=args.get("quantity", None)
        product = Product.query.filter_by(product_name=name).first()
        if product:
             raise AlreadyExistsError(status_code=409,  error_message="Product name already exists")
        
        new_product = Product(product_name=name, Description=Description, 
                              Catagory_id=Catagory_id, price_per_unit=price_per_unit,
                              Stock=Stock, image_url=image_url, manufacture_date=manufacture_date,
                              expairy_date=expairy_date, timestamp=datetime.now(), quantity=unit)
        
        db.session.add(new_product)
        db.session.commit()
        
        return {"message":"Successfully created the product"}, 200
    


class ProductApi(Resource):
    @auth_required("token")
    @marshal_with(output_product_field)
    def get(self,id): 
        product = Product.query.filter_by(product_id=id).first()
        # print(product)
        if product is None:
             raise SchemaValidationError(status_code=404, error_message="sorry!! No product  found")
        return product

    @auth_required("token")
    @roles_accepted("Admin","Manager")
    @marshal_with(output_product_field)
    def put(self, id):
        cache.clear()
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
        unit=args.get("quantity", None)
        
        update_product.product_name = name
        update_product.Description = Description
        update_product.Catagory_id = Catagory_id
        update_product.price_per_unit = price_per_unit
        update_product.Stock = Stock
        update_product.image_url = image_url
        update_product.manufacture_date = manufacture_date
        update_product.expairy_date = expairy_date
        update_product.quantity=unit
        db.session.commit()
        return {"message":"Successfully updated product"},200
    

    @auth_required("token")
    @roles_accepted("Admin","Manager")
    def delete(self, id):
        cache.clear()
        product= Product.query.filter_by(product_id=id).first()
        if product is None:
            raise SchemaValidationError(status_code=404, error_message="product not found")
        else:
            db.session.delete(product)
            db.session.commit()
            return {"message":"Successfully deleted the product"}, 200

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
        #print(products)
        
        
        return products
        
class search_category(Resource):
    @auth_required("token")
    @marshal_with(output_Category_field)
    def post(self):
        
        args=search_parser.parse_args()
        search_word=args.get("search_word", None)
        # print(search_word)
        
        if search_word:
            search = f"%{search_word}%"
            category= Category.query.filter(Category.category_name.like(search)).all()
            return category
        
class CartApi(Resource):
    # @auth_required("token")
    @marshal_with(output_cart_field)
    def get(self):
        user_id=current_user.id
        #print(user_id)
        carts=Cart.query.filter_by(user_id=user_id).all()
        if carts:
            return carts
        else:
            return {"message":"Your cart is empty!! Continue shopping to browse and search for items."}, 204
    @auth_required("token")
    @marshal_with(output_cart_field)
    def post(self):
        user_id=current_user.id
        #print(user_id)
        arg = cart_parser.parse_args()
        product_id=arg.get("product_id", None)
        quantity = int(arg.get("quantity", 0))
        user_id = current_user.id
        
        product=Product.query.filter_by(product_id=product_id).first()

        if product is None:
            raise SchemaValidationError(status_code=404, error_message="sorry, No product found ")
        cart=Cart.query.filter_by(product_id=product_id , user_id=user_id).first()
    
        if cart:
            cart.quantity= cart.quantity+quantity
            cart.total_price = cart.quantity * cart.price_per_unit
        
        else:
            cart = Cart(product_id = product.product_id, quantity = quantity, user_id =user_id, price_per_unit = product.price_per_unit, total_price=(quantity*product.price_per_unit))
          
        db.session.add(cart)
        db.session.commit()
        return cart
    
    @auth_required("token")
    @marshal_with(output_cart_field)
    def put(self):
        user_id=current_user.id
        #print(user_id)
        arg = cart_parser.parse_args()
        product_id=arg.get("product_id", None)
        quantity = int(arg.get("quantity", 0))
        user_id = current_user.id
        product=Product.query.filter_by(product_id=product_id).first()
        if product is None:
            raise SchemaValidationError(status_code=404, error_message="sorry, No product found ")
        cart=Cart.query.filter_by(product_id=product_id , user_id=user_id).first()
        
        cart.quantity= cart.quantity-quantity
        cart.total_price = cart.quantity * cart.price_per_unit
        db.session.commit()
        return cart
        
    @auth_required("token")
    def delete(self, cart_id) :
        # print(cart_id)
        cart=Cart.query.filter_by(cart_id=cart_id).first()
        
        if cart :            
            db.session.delete(cart)        
            db.session.commit()            
            return ("successfully removed item from the cart", 200)
        else:
            raise SchemaValidationError(status_code=404, error_message="product not found in cart")
        
class OrderApi(Resource):
    @auth_required("token")
    @marshal_with(output_order_field)
    def get (self,order_id):
        user_id=current_user.id
        orderObject=Order.query.filter_by(order_id=order_id).first()

        if orderObject is None:
             raise SchemaValidationError(status_code=404, error_message="sorry!! No order found")

        return orderObject
    @auth_required("token")
    @marshal_with(output_order_field)
    def post(self):
        args= order_parser.parse_args()
        payment=args.get("selectedpayment",None)
        address=args.get("selectedaddress",None)
        user_id = current_user.id
        cart_items=Cart.query.filter_by(user_id=user_id).all()
        if cart_items == []:
            raise SchemaValidationError(status_code=404, error_message="there is no item in cart ") 
        total_price=0
        for item in cart_items:
            total_price=total_price+item.total_price
            item.product.Stock=item.product.Stock-item.quantity
        
        new_order = Order(user_id=user_id, total_price=total_price,  
                    order_date=datetime.now(),
                    payment_id=payment,
                    address_id=address)
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
        print(order_item)
        return order_item
        
class AllOrder(Resource):
    @auth_required("token")
    @marshal_with(output_order_field)
    def get(self):
        id=current_user.id
        # print(id)
        orders=Order.query.filter_by(user_id=id).all()
        # print(orders)
        return orders 
class AddressApi(Resource):
    @auth_required("token")
    @marshal_with(output_address_field)
    def get(self):
        user_id=current_user.id
        address = Address.query.join(user_model).filter_by(id=user_id).all()
        return address
    def post(self):
        user_id = current_user.id
        args= address_parser.parse_args()
        street=args.get("street", None)
        city = args.get("city", None)
        state = args.get("state",  None)
        postal_code= args.get("postal_code", None)
        address= Address(user_id=user_id, street=street, city=city, postal_code=postal_code, state=state)
        
        db.session.add(address)
        db.session.commit()
        return {"message":"succefully added the address"}, 200
    @auth_required("token")
    def put(self,id):
        user_id = current_user.id
        args= address_parser.parse_args()
        username=args.get("username", None)
        street=args.get("street", None)
        city = args.get("city", None)
        state=args.get("state",None)
        postal_code= args.get("postal_code", None)
        update_address= Address.query.filter_by(address_id=id).first()
        update_address.user_id=user_id
        update_address.street= street
        update_address.city=city
        update_address.postal_code=postal_code
        update_address.state=state
        
        
        db.session.commit()
        return {"message": "successfully updated address details"}
    @auth_required('token')
    def delete(self,id):
    
        address=Address.query.filter_by(address_id=id).first()
        if address:
            db.session.delete(address)
            
            db.session.commit()
            return {"message":"successfully removed address deatails"}
        else:
            raise SchemaValidationError(status_code="404", error_message="no address details found")


class PaymentApi(Resource):
    @auth_required("token")
    @marshal_with(output_payment_field)
    def get(self):
        user_id=current_user.id
        payment=Payment.query.filter_by(user_id=user_id).all()
        return payment
    @auth_required("token")
    def post(self):
        args=payment_parser.parse_args()
        user_id=current_user.id
        type=args.get("type",None)
        card_number=args.get("card_number",None)
        cvv=args.get("cvv",None)
        expiry_date=args.get("expiry_date",None)
        payment=Payment(user_id=user_id, card_number=card_number,cvv=cvv,expiry_date=expiry_date, type=type)
        db.session.add(payment)
        db.session.commit()
        return {"message": "successfully added the payment details"}
    @auth_required("token")
    def put(self,id):
        args=payment_parser.parse_args()
        user_id=current_user.id
        card_number=args.get("card_number",None)
        cvv=args.get("cvv",None)
        expiry_date=args.get("expiry_date",None)
        update_payment=Payment.query.filter_by(payment_id=id).first()
        update_payment.user_id=user_id
        update_payment.card_number=card_number
        update_payment.cvv=cvv
        update_payment.expiry_date=expiry_date
        db.session.commit()
        return {"message": "succesfully update payment details"}
    @auth_required("token")
    def delete(self,id):
        payment=Payment.query.filter_by(payment_id=id).first()
        # print(payment.payment_id)
        
        if payment:
            db.session.delete(payment)
            
            db.session.commit()
            return {"message":"successfully removed payment deatails"}
        else:
            raise SchemaValidationError(status_code="404", error_message="no payment details found")

class AdminApprovalSignUpRequest(Resource):
    @auth_required("token")
    @roles_required("Admin")
    @marshal_with(output_user_field)
    def get(self):
        inactive_manager= user_model.query.filter_by(active=False).all()
        print(len(inactive_manager))
        if  len(inactive_manager) == 0 :
            return {"status":404, "error_message":"no new Manager SignUp "}
        else:
            return inactive_manager
    @auth_required("token")
    @roles_required("Admin")
    def put(self, id):
        manager=user_model.query.filter_by(id=id).first()
        customer_role=Role.query.filter_by(name="Customer").first()
        if customer_role is not None:
            role = RolesUsers.query.filter_by(user_id=manager.id, role_id=customer_role.id).first()
            if role is not None:
                db.session.delete(role)
                manager.active=True
                db.session.commit()
                notify_manager_for_signup_Approval(id)
                return {"message" : "manager role approved from admin"}, 200
    
class AdminRejectSignUpRequest(Resource):
    @auth_required("token")
    @roles_required("Admin")
    def put(self, id):
        manager=user_model.query.filter_by(id=id).first()
        # print(manager.active)
        manager.active=True
        db.session.commit()
        manager_role = Role.query.filter_by(name="Manager").first()
        if manager_role is not None:
            role = RolesUsers.query.filter_by(user_id=manager.id, role_id=manager_role.id).first()

            if role is not None:
                db.session.delete(role)  
                db.session.commit()
                notify_manager_for_signup_reject(id)
                return {"message" : "manager role rejected from admin"}, 200
        
class AdminApprovalCategoryRequest(Resource):
    @auth_required("token")
    @roles_required("Admin")
    @marshal_with(output_Category_field)
    def get(self):
        Categories=Category.query.filter_by(approve=False , updateRequest=False, deleteRequest=False).all()
        print(len(Categories))
        if len( Categories)==0:
             return {"status":204, "error_message":"No new category approval Request "}
        else:
            return Categories
    @roles_required("Admin")
    def put(self, id):
        category= Category.query.filter_by(category_id=id).first()
        category.approve=True
        db.session.commit()
        return {"message": "Admin approved  new category request. Please proceed with the changes."},200
    @auth_required("token")
    @roles_required("Admin")
    def delete(self,id):
        category=Category.query.filter_by(category_id=id).first()
        # category.approve=True
        db.session.delete(category)
        db.session.commit()
        return {"message": "Admin rejected new category request . Please proceed with the changes."},200
       
class ApprovreCategoryUpdateDeleteRequest(Resource):
    @auth_required("token")
    @roles_required("Admin")
    @marshal_with(output_Category_field)
    def get(self):
        category= Category.query.filter_by(updateRequest=True).all()
        return category
    @auth_required("token")
    @roles_required("Admin")
    def put(self, id):
        #retrive the category from redis
        category_json = redis_client.get(id)
        print(category_json)
        # Check if the category exists in Redis
        if category_json is None:
            return {"errormessage": f"Category with ID {id} not found in Redis"}, 404

        # Deserialize the JSON string from Redis
        category = json.loads(category_json)
        print(category['category_name'])

        # Update the category in the database
        db_category = Category.query.filter_by(category_id=id).first()

        if db_category is not None:
            db_category.updateRequest = False
            db_category.category_name = category.get('category_name', db_category.category_name)
            db_category.imagelink = category.get('imagelink', db_category.imagelink)

            db.session.commit()
            print("data after update:", db_category.category_name)
            redis_client.delete(id)
            return {"message": "Admin approved the category update. Please proceed with the changes."}, 200
        else:
            return {"errormessage": f"Category with ID {id} not found in the database"}, 404
            
    @auth_required("token")
    @roles_required("Admin")
    def delete(self,id):
        category=Category.query.filter_by(category_id=id).first()
        db.session.delete(category)
        db.session.commit()
        return {"message": "Admin approved the category delete. Please proceed with the changes."},200

class RejectCategoryUpdateDeleteRequest(Resource):
    @auth_required("token")
    @roles_required("Admin")
    @marshal_with(output_Category_field)
    def get(self):
        category= Category.query.filter_by(deleteRequest=True).all()
        return category
    @auth_required("token")
    @roles_required("Admin")
    def put(self,id):
        category= Category.query.filter_by(category_id=id).first()
        if category.updateRequest==True:
            category.updateRequest=False
            db.session.commit()
            return {"message": "Admin rejected the category update. Please proceed with the changes."},200
    @auth_required("token")
    @roles_required("Admin")
    def delete(self,id):
        category= Category.query.filter_by(category_id=id).first()
        if category.deleteRequest==True:
            category.deleteRequest=False
            db.session.commit()
            return {"message": "Admin rejected the category delete. Please proceed with the changes."},200




api.add_resource(Users, "/users")
api.add_resource(UserApi, "/user", "/user/register")
api.add_resource(Categories, "/category")
api.add_resource(CategoryApi, "/category/<id>")
api.add_resource(products, "/product")
api.add_resource(search_category, "/category/search")
api.add_resource(ProductApi,  "/product/<int:id>", "/product/category/<string:category_name>")
api.add_resource(search_product, "/product/search")
api.add_resource(CartApi,  "/cart/<int:cart_id>", "/cart")
api.add_resource(OrderApi, "/order","/order/<int:order_id>")
api.add_resource(AddressApi, "/address", "/address/<int:id>")
api.add_resource(PaymentApi, "/payment", "/payment/<int:id>")
api.add_resource(ManagerApi,  "/manager/register")
api.add_resource(AdminApprovalSignUpRequest, "/Admin_approval", "/Admin_approval/<int:id>")
api.add_resource(AdminRejectSignUpRequest,  "/Admin_reject/<int:id>")
api.add_resource(AdminApprovalCategoryRequest,  "/Admin_Approval_category_request", "/Admin_Approval_category_request/<int:id>")
api.add_resource(ApprovreCategoryUpdateDeleteRequest, "/categoryUpdateRequest","/categoryUpdateRequest/<int:id>", "/categoryDeleteRequest/<int:id>")
api.add_resource( RejectCategoryUpdateDeleteRequest, "/categoryDeleteRequest", "/rejectCategoryUpdateRequest/<int:id>",  "/rejectCategoryDeleteRequest/<int:id>")
api.add_resource(AllOrder,"/allOrder")