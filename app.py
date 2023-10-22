from flask import Flask, render_template
from api.resource import   api
from model import db, User, Role
from security import user_datastore, sec
from flask_security import Security, auth_required,LoginForm
from flask_security.utils import hash_password 

app = Flask(__name__)

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


@app.before_request  
def CreateDB():
    db.create_all()  
    if not user_datastore.find_role("Admin"):
        user_datastore.create_role(name="Admin")
        db.session.commit()

    if not user_datastore.find_role("Customer"):
        user_datastore.create_role(name="Customer")
        db.session.commit()
    
    if not user_datastore.find_role("Manager"):
        user_datastore.create_role(name="Manager")
        db.session.commit()

    if not user_datastore.find_user(email="user1@gmail.com"):
        user_datastore.create_user( username="user1",password=hash_password("1234"),  email="user1@gmail.com", roles=['Admin'] )
        db.session.commit()

@app.route("/")
def home():
    return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)