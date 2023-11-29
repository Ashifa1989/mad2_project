from flask import   Flask, render_template, send_file, jsonify
# from flask_security import SQLAlchemyUserDatastore, Security
from flask_security.utils import hash_password
from application.model import db, User, Role
from config import DevelopmentConfig
from application.resource import api
from application.security import user_datastore, sec
from application.worker import create_celery_app
from application.cachedata import cache
from application.tasks import *
from celery.schedules import crontab
from application.tasks import *


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    sec.init_app(app, user_datastore)
    cache.init_app(app)
    with app.app_context():
        import application.view, application.resource

    return app

app = create_app()
celery_app = create_celery_app(app)

@app.before_first_request 
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
        user_datastore.create_user( username="user1",password=hash_password("1234"),  email="user1@gmail.com",  roles=['Admin'] )
        db.session.commit()


@celery_app.on_after_finalize.connect
def setup_periodic_tasks_for_dailyremainder(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=21, minute=20),  # Schedule daily 
        send_remainder_via_email.s(),  # Task to execute
        name="remainder mail for user"  # Name of the task
    )

@celery_app.on_after_finalize.connect
def setup_periodic_tasks_for_monthly_report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=21, minute=20, day_of_month='28'),  # Schedule monthly 
        generate_send_monthly_report_via_email.s(),  # Task to execute
        name="users_monthly_report"  # Name of the task
    )



if __name__ == '__main__':
    app.run(debug=True)