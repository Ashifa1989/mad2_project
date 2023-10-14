from flask import Flask, render_template
from api.resource import   api
from model import db, User, Role
from security import user_datastore, sec
from flask_security import Security, auth_required
from flask_security.utils import hash_password

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = '1004@ayz'
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['WTF_CSRF_ENABLED'] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] ='Authentication-token'
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'


api.init_app(app) #integrate the api with flask app
db.init_app(app)
sec.init_app(app, user_datastore)
# app.security = Security(app, user_datastore)

@app.before_first_request
def create_db():
    
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
        user = user_datastore.create_user( username="user1", email="user1@gmail.com", password=hash_password("1234"), fs_uniquifier="2")
        admin_role = user_datastore.find_role("Admin")
        user_datastore.add_role_to_user(user, admin_role)
        
        db.session.add(user)
        db.session.commit()

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)