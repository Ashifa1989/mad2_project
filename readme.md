Root file name is mad2_project. This folder consists of following files,

instance/database.db:  stores application data
static/components: contains all the components essential for frontend interface
template/index.html:  primary entry point for application frontend, responsible for rendering the initial user interface.
app.py: main entry point for the backend server and application logic, managing backend functionalities and serving as the main backend entry point.
config.py: contains all the configuration essential for the application
celeryconfig.py : contains the configuration essential for celery job
Application.py file consists of following file:

resource.py:  all the Api and their end point
view.py:  contains the functions to render the index.html page.
cashedata.py:  perform database query and retrieve data and functioning as an intermediate within application
model.py: contains data model used within the application
security.py: contains user data store object and security object
tasks.py: defined all the task
worker.py: define the function to create celery object
requirements.txt: contains list of required packages and their versions necessary for the application to function properly.
LeafGroceryShopApi.yaml: contains API endpoint documentation in YAML format, detailing the structure, functionalities, and specifications of the application's API endpoints.


Create and activate a virtual environment
Install the required packages using pip install -r requirements.txt
Run the app using python app.py