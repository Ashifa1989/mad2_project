from flask_security import Security, SQLAlchemyUserDatastore
from application.model import db, User, Role 

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
sec = Security()
