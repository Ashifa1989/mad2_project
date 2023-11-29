from flask import  current_app as app, Flask, render_template, send_file, jsonify
from celery.result import AsyncResult
from application.tasks import *
from celery.schedules import crontab
from config import *

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/DownloadCSVFile")
def DownloadCSVFile():
    
        a=generate_productDetails_csv.delay()
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


@app.route("/notify_manager_csv_download/<id>")
def notify_manager_csv_download(id):
    try:
        a=notify_manager_for_Download_csv_via_email.delay(id)
        return{
                "task_id": a.id,
                "task_state" :a.state,
                "task_result": a.result
                
            }
    except Exception as e:
        return jsonify({"error": str(e)})




