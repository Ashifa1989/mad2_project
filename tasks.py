from worker import create_celery_app
from celery import shared_task
from model import db,User,Product, Order, Role
from httplib2 import Http
from json import dumps
from flask_mail import Message
import csv
import base64
import pickle
import redis
from datetime import datetime, timedelta, date
from celery.schedules import crontab
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import smtplib
from smtplib import SMTP
from flask import jsonify
from datetime import datetime as dt, timedelta, date
from config import *
from flask_security import current_user


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



@shared_task
def new_category_approval_request():
    url = "https://chat.googleapis.com/v1/spaces/AAAAJavNvqQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=exJDyF2pmVGcFSEgfeV97RFarCwqhc4QvXkxKtWqMTw"
    app_message = {
        'text': "A category  is created, click here to approve: http://127.0.0.1:5000/#/adminDashboard. ",
        }

    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
                
@shared_task
def update_category_approval_request():
    url = "https://chat.googleapis.com/v1/spaces/AAAAJavNvqQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=exJDyF2pmVGcFSEgfeV97RFarCwqhc4QvXkxKtWqMTw"
    

    app_message = {
        'text': "A category  is updated, click here to approve: http://127.0.0.1:5000/#/adminDashboard. ",
        }
    
    
    
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
                
@shared_task
def delete_category_approval_request():
    url = "https://chat.googleapis.com/v1/spaces/AAAAJavNvqQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=exJDyF2pmVGcFSEgfeV97RFarCwqhc4QvXkxKtWqMTw"
    app_message = {
        'text': "A category  is deleted, click here to approve: http://127.0.0.1:5000/#/adminDashboard. ",
        }
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
                


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
    print("CSV file generation completed successfully!")
    return True








def send_email_with_attachment(to_address, subject, message, content="html", attachment_file=None, html_content=None):
        msg = MIMEMultipart()
        msg['From'] = "user1@gmail.com"
        msg['To'] = to_address
        msg['Subject'] = subject
        if content == "html":
            msg.attach(MIMEText(message, "html"))
        else:
            msg.attach(MIMEText(message, "plain"))
        if attachment_file:
            with open(attachment_file, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename= {attachment_file}')
                # msg.attachment(part)
                msg.attach(part)

        s=smtplib.SMTP(host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
        s.login(SENDER_ADDRESS, SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True
    
import logging

logger = logging.getLogger(__name__)

    

@shared_task
def generate_send_monthly_report_via_email():
  try:
    today = date.today()
    start_of_month = date(today.year, today.month, 1)
    end_of_month = start_of_month.replace(day=28) + timedelta(days=4)
    users = User.query.all()
    # for customer in users:
    #     id=customer.id 
    # Fetch orders from the database based on the date range 
    orders=Order.query.join(User).filter(Order.user_id==User.id, Order.order_date >= start_of_month, Order.order_date <= end_of_month).group_by(Order.user_id).all()    
    # Creating the HTML content for the email
    print(orders)
    for order in orders:
            name=order.user.username
            email=order.user.email
            # print(name)
            # print(email)
            orders_count = len(orders)
            print(orders_count)
            total_expenditure = sum(order.total_price for order in orders)
            print(total_expenditure)
            month_year = dt.now().strftime('%B %Y')
            

            html_content = f"""
                <html>
                    <body>
                        
                        <h2>Monthly Activity Report - {month_year}</h2>
                        <p>Dear {name},</p>
                        <p>Here is your activity report for the month of {month_year}</p>
                        <p><strong>Total Orders Made:</strong> {orders_count}</p>
                        <p><strong>Total Expenditure:</strong> RM{total_expenditure:.2f}</p>
                        <p>Feel free to contact us for any queries!</p>
                        <p>Best regards,<br>Leaf Grocery Shop</p>
                    </body>
                </html>
                """
                
            # Saving the html content as a file
            file_name = f"{name}'s_{month_year}_activity.html"
            with open(file_name, "w") as f:
                f.write(html_content)
            send_email_with_attachment (
                        to_address=email,
                        subject="Monthly activity report",
                        message="Hello {},attached your monthly report.please look into it. Hava a nice day".format(name),
                        content="html",
                        attachment_file=file_name,
                        html_content=html_content
                        
                        )
   
    logger.info("Monthly report sent successfully")
  except Exception as e:
        # Log any exceptions that occurred
        logger.exception("Error occurred while sending monthly report: %s", e)





@shared_task
def send_remainder_via_email():
    current_time = datetime.utcnow()
    inactive_time = timedelta(hours=24,minutes=0, seconds=0)
    customers = User.query.filter(User.roles.any(Role.name == 'Customer')).all()
    for customer in customers:
        customer_timestamp = customer.timestamp

    # Calculate the time difference between the current time and the user's timestamp
        time_since_last_activity = current_time - customer_timestamp

        if time_since_last_activity > inactive_time:
                # print(customer)
                send_email (
                      to_address=customer.email,
                      subject="We miss you",
                      message="Hello {}! It's been a while since you've visited. Explore our latest addition to the shop since your last visit!".format(customer.username)
                      )
    return jsonify({"status": "success", "message": "Email should arraive in your inbox shortly"})


def send_email(to_address, subject, message,content="text", attachment_file=None):
   
    msg = MIMEMultipart()
    msg['From'] = "user1@gmail.com"
    msg['To'] = to_address
    msg['Subject'] = subject
    if content == "html":
        msg.attach(MIMEText(message, "html"))
    else:
        msg.attach(MIMEText(message, "plain"))
    # if attachment_file:
    #     with open(file_path, 'rb') as attachment:
    #         part = MIMEBase('application', 'octet-stream')
    #         part.set_payload(attachment.read())
    #         encoders.encode_base64(part)
    #         part.add_header('Content-Disposition', f'attachment; filename= {file_path}')
    #         msg.attach(part)
    s=smtplib.SMTP(host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True

@shared_task
def notify_manager_for_Download_csv_via_email(id):
    
    manager = User.query.filter(User.id == id).first()
    send_email(to_address=manager.email,
                        subject="Export CSV",
                        message="Dear {}, I wanted to inform you that  downloading the product information CSV file has been successfully executed.".format(manager.username),
                        ) 
    return jsonify({"status": "success", "message": "Email should arraive in your inbox shortly"})