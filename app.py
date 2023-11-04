from flask import Flask, render_template, send_file
from api.resource import api
from model import db, User, Role, Product
from security import user_datastore, sec
from flask_security import Security, auth_required,LoginForm
from flask_security.utils import hash_password
from worker import  create_celery_app
import csv
from celery.result import AsyncResult
import tasks

app = Flask(__name__)

app.config.from_mapping(
    CELERY=dict(
        broker_url="redis://localhost:6379/1",
        result_backend="redis://localhost:6379/2",
        task_ignore_result=True,
    ),
)
celery_app = create_celery_app(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = '1004@ayz'
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['WTF_CSRF_ENABLED'] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] ='Authentication-Token'
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'
# app.config["SECURITY_EMAIL_VALIDATOR_ARGS"] = {"check_deliverability": False}

api.init_app(app) #integrate the api with flask app
db.init_app(app)
sec.init_app(app, user_datastore)

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
#         user_datastore.create_user( username="user1",password=hash_password("1234"),  email="user1@gmail.com", roles=['Admin'] )
#         db.session.commit()


# @celery_app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(10.0, generate_productDetails_csv(), name="generate product details" )



            



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

@app.route("/send_admin_approval_request")
def send_admin_approval_request():
    a=tasks.send_admin_approval_request.delay()
    return{
        "task_id": a.id,
        "task_state" :a.state,
        "task_result": a.result
        }
    

@app.route("/")
def home():
    return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)