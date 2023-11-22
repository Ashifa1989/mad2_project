from flask import Flask, render_template, send_file, jsonify
from api.resource import api
from model import db, User, Role, Product, Category, Order
from security import user_datastore, sec
from flask_security import Security, auth_required,LoginForm
from flask_security.utils import hash_password
from worker import  create_celery_app
import csv
from celery.result import AsyncResult
import tasks
from datetime import datetime as dt, timedelta, date
from celery.schedules import crontab


from flask_mail import Mail, Message
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import smtplib
from smtplib import SMTP
from flask_caching import Cache








app = Flask(__name__)

app.config.from_mapping(
    CELERY=dict(
        broker_url="redis://localhost:6379/1",
        result_backend="redis://localhost:6379/2",
        task_ignore_result=True,
        # timezone="Asia/Kolkata"
        timezone="Asia/Kuala_Lumpur"  
    ),
)


app.config['MAIL_USERNAME'] = 'your_username'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = '1004@ayz'
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['WTF_CSRF_ENABLED'] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] ='Authentication-Token'
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'
# app.config['SECURITY_TOKEN_MAX_AGE'] = 600000
# app.config["SECURITY_EMAIL_VALIDATOR_ARGS"] = {"check_deliverability": False}

CACHE_TYPE="RedisCache" 
CACHE_REDIS_HOST="localhost"
CACHE_REDIS_PORT=6379

api.init_app(app) #integrate the api with flask app
db.init_app(app)
sec.init_app(app, user_datastore)
mail = Mail(app)
cache=Cache(app)
# mail = Mail()
# mail.init_app(app)

celery_app = create_celery_app(app)
# @app.before_first_request 
# def CreateDB():
#     db.create_all()  
#     if not user_datastore.find_role("Admin"):
#         user_datastore.create_role(name="Admin")
#         db.session.commit()

#     if not user_datastore.find_role("Customer"):
#         user_datastore.create_role(name="Customer")
#         db.session.commit()
    
#     if not user_datastore.find_role("Manager"):
#         user_datastore.create_role(name="Manager")
#         db.session.commit()

#     if not user_datastore.find_user(email="user1@gmail.com"):
#         user_datastore.create_user( username="user1",password=hash_password("1234"),  email="user1@gmail.com",  roles=['Admin'] )
#         db.session.commit()


# @celery_app.on_after_configure.connect
# def setup_periodic_tasks_for_dailyremainder(sender, **kwargs):
#     sender.add_periodic_task(10.0, tasks.send_remainder_via_email.s(), name="remainder mail for user" )


@celery_app.on_after_finalize.connect
def setup_periodic_tasks_for_dailyremainder(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=20, minute=30),  # Schedule daily 
        tasks.send_remainder_via_email.s(),  # Task to execute
        name="remainder mail for user"  # Name of the task
    )

@celery_app.on_after_finalize.connect
def setup_periodic_tasks_for_monthly_report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=22, minute=25,day_of_month='1'),  # Schedule monthly 
        tasks.generate_send_monthly_report_via_email.s(),  # Task to execute
        name="users_monthly_report"  # Name of the task
    )


            



@app.route("/trigger-celery-task")
def celeryTask():
    
        a=tasks.generate_productDetails_csv.delay()
        return{
            "task_id": a.id,
            "task_state" :a.state,
            "task_result": a.result
        }

@app.route("/status/<task_id>")
def CeleryTaskStatus(task_id):
        task = AsyncResult(task_id)
        return {
            "task_id": task.id,
            "task_state": task.state,
            "task_result": task.result
        }

@app.route("/download-file")    
def download_file():
        return send_file("static/product_data.csv")

# @app.route("/send_admin_approval_request")
# def send_admin_approval_request():
#     a=tasks.send_admin_approval_request.delay()
#     return{
#         "task_id": a.id,
#         "task_state" :a.state,
#         "task_result": a.result
#         }
# @app.route("/new_category_approval_request")
# def new_category_approval_request():
#     a=tasks.new_category_approval_request.delay()
#     return{
#         "task_id": a.id,
#         "task_state" :a.state,
#         "task_result": a.result
#         }

# @app.route("/update_category_approval_request/<int:id>", methods=["post"])
# def update_category_approval_request(id):
    
#     #get data from api body and create category object
#     # Store the category information in Redis

#     redis_key = str(id)
#     redis_client.set(redis_key, category)
#     a=tasks.update_category_approval_request.delay()
#     return{
#         "task_id": a.id,
#         "task_state" :a.state,
#         "task_result": a.result,
#         "redis_key": redis_key
#         }

# @app.route("/delete_category_approval_request")
# def delete_category_approval_request():
#     a=tasks.delete_category_approval_request.delay()
#     return{
#         "task_id": a.id,
#         "task_state" :a.state,
#         "task_result": a.result
#         }




                


   

@app.route("/")
def home():
    return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)