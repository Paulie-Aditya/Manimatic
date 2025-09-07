from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from flask_cors import CORS
from gemini_functions import generate_manim_code_safe
import uuid
import threading
import json
import google.auth
from google.auth.transport.requests import Request
import requests

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

job_store = {}

PROJECT_ID = os.getenv("GCP_PROJECT_ID")
REGION = os.getenv("GCP_REGION", "asia-south2")
WORKER_JOB_NAME = os.getenv("WORKER_JOB_NAME", "manimatic-worker")

# Get auth token for Cloud Run Jobs API
def get_access_token():
    creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
    creds.refresh(Request())
    return creds.token

def launch_worker(job_id, code):
    url = f"https://{REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/{PROJECT_ID}/jobs/{WORKER_JOB_NAME}:run"

    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    payload = {
        "overrides": {
            "containerOverrides": [{
                "name": "manimatic-worker",
                "env": [
                    {"name": "JOB_ID", "value": job_id},
                    {"name": "CODE", "value": code},
                    {"name": "CLOUDINARY_CLOUD_NAME", "value": os.getenv("CLOUDINARY_CLOUD_NAME")},
                    {"name": "CLOUDINARY_API_KEY", "value": os.getenv("CLOUDINARY_API_KEY")},
                    {"name": "CLOUDINARY_API_SECRET", "value": os.getenv("CLOUDINARY_API_SECRET")}
                ]
            }]
        }
    }

    resp = requests.post(url, headers=headers, data=json.dumps(payload))
    if resp.status_code != 200:
        return False, resp.text
    return True, resp.json()

@app.route("/")
def root():
    return {"status": "ok"}, 200

@app.route("/ping")
def ping():
    return {"message": "pong"}, 200

def run_generation_thread(user_prompt, job_id):
    try:
        explanation, code = generate_manim_code_safe(user_prompt, job_id)
        if not code:
            job_store[job_id] = {"status": "failed", "error": "No code generated"}
            return

        success, result = launch_worker(job_id, code)
        if not success:
            job_store[job_id] = {"status": "failed", "error": result}
        else:
            job_store[job_id] = {"status": "running", "explanation": explanation}

    except Exception as e:
        job_store[job_id] = {"status": "failed", "error": str(e)}

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_prompt = data['prompt']
    job_id = str(uuid.uuid4())[:8]
    job_store[job_id] = {"status": "pending"}

    thread = threading.Thread(target=run_generation_thread, args=(user_prompt, job_id))
    thread.start()

    return jsonify({"job_id": job_id, "status": "started"}), 202

@app.route("/status/<job_id>", methods=["GET"])
def get_status(job_id):
    job = job_store.get(job_id)
    if not job:
        return {"message": "Invalid job ID"}, 404
    return job, 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
