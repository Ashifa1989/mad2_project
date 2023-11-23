from flask import Flask, render_template, send_file, jsonify

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
SMPTP_SERVER_HOST="192.168.0.160"
SMPTP_SERVER_PORT= 1025
SENDER_ADDRESS="email@user1.com"
SENDER_PASSWORD=""


db.init_app(app)
sec.init_app(app, user_datastore)
mail = Mail(app)
cache=Cache(app)
# mail = Mail()
# mail.init_app(app)

celery_app = create_celery_app(app)