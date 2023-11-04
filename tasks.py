from worker import create_celery_app
from celery import shared_task
from model import db,User,Product
from httplib2 import Http
from json import dumps
import csv

# @celery_app.task
# def notify_inactive_users():
#     # current_time = datetime.utcnow()
#      #INACTIVITY_THRESHOLD = timedelta(hours=24)
#     # Retrieve users and their timestamps from the database
#     users = User.query.all()  # Query your user model

#     # Iterate through the users
#     for user in users:
#         # user_timestamp = user.timestamp

#         # Calculate the time difference between the current time and the user's timestamp
#         # time_since_last_activity = current_time - user_timestamp

#         # if time_since_last_activity > INACTIVITY_THRESHOLD:
#             send_notification(user.id)
# def send_notification(user_id):
#     url = "https://chat.googleapis.com/v1/spaces/AAAAJavNvqQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=exJDyF2pmVGcFSEgfeV97RFarCwqhc4QvXkxKtWqMTw"
#     app_message = {
#         'text': ' we missed you. You have been inactive for more than 24 hours'}
#     message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
#     http_obj = Http()
#     response = http_obj.request(
#         uri=url,
#         method='POST',
#         headers=message_headers,
#         body=dumps(app_message),
#     )
#     print("senting notification")



@shared_task
def send_admin_approval_request():
    url = "https://chat.googleapis.com/v1/spaces/AAAAJavNvqQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=exJDyF2pmVGcFSEgfeV97RFarCwqhc4QvXkxKtWqMTw"
    app_message = {
        'text': 'A new sign in from Manager. '}
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
# @shared_task
# def admin_approval(id):
#     user=user.query.filter_by(id=id).first()
#     if user and "manager" in user.roles:
#         user.active=True
#         db.session.commit()
#         # send_mail_tomanger(user.id)
    

# # @celery_app.task
# # def send_mail_tomanger(id):
    
                



@shared_task
def generate_productDetails_csv():
    products=Product.query.all()
    fields=["product_id", "product_name", "Description", "Catagory_id", "price_per_unit", "Stock", "image_url", "manufacture_date",  "expairy_date","timestamp","quantity"]
    rows=products
    print(rows)
    # for product in products:
    #     rows.append(product)
    #write to csv file
    with open("static/product_data.csv", "w") as csvfile:
        #create a csv writer object
        csvwriter=csv.writer(csvfile)

        #write the field
        csvwriter.writerow(fields)
        for product in products:
            product_data = [
                product.product_id,
                product.product_name,
                product.Description,
                product.Catagory_id,
                product.price_per_unit,
                product.Stock,
                product.image_url,
                product.manufacture_date,
                product.expairy_date,
                product.timestamp,
                product.quantity
            ]
            
            # Write the product data to the CSV
            csvwriter.writerow(product_data)


# @shared_task(ignore_result=False)
# def sum(a,b):
#     return a+b