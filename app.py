from flask import Flask, render_template

from api.resource import   api

app = Flask(__name__)
api.init_app(app) #integrate the api with flask app

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)