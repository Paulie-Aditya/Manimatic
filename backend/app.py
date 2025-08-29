from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from flask_cors import CORS
from gemini_functions import generate_manim_code_safe
import uuid 
import threading
import docker
import json
from helper import cleanup_text

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

job_store={}
client = docker.from_env()

@app.route("/ping", methods= ["GET"])
def ping():
    return jsonify({"message": "Pinged"}),200

@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Hello World"})

def run_generation_thread(user_prompt, job_id):
    try:
        explanation, code = generate_manim_code_safe(user_prompt, job_id)
        
        if not code:
            job_store[job_id] = {"status": "failed", "error": "Failed to generate code"}
            return
        
        # Spawn worker container
        container = client.containers.run(
            "manimatic-worker:latest",
            detach=True,
            environment={
                "JOB_ID": job_id,
                "CODE": code,
                "EXPLANATION": explanation,
                "CLOUDINARY_CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
                "CLOUDINARY_API_KEY": os.getenv("CLOUDINARY_API_KEY"),
                "CLOUDINARY_API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
            },
            remove=True,
            mem_limit="2g",
            network_disabled=True,
            read_only=True,
            tmpfs={'/tmp': 'rw,noexec,nosuid,size=100m'}
        )
        
        result = container.wait()
        logs = container.logs().decode('utf-8')
        
        try:
            lines = logs.strip().split('\n')
            for line in reversed(lines):
                if line.strip().startswith('{') and line.strip().endswith('}'):
                    worker_result = json.loads(line)
                    if worker_result.get('status') == 'success':
                        job_store[job_id] = {
                            "status": "complete",
                            "url": worker_result.get('url'),
                            "code": worker_result.get('code'),
                            "explanation": cleanup_text(worker_result.get('explanation'))
                        }
                        return
                    else:
                        job_store[job_id] = {
                            "status": "failed",
                            "error": worker_result.get('error', 'Unknown error')
                        }
                        return
        except json.JSONDecodeError:
            job_store[job_id] = {
                "status": "failed",
                "error": "Failed to parse worker output"
            }
    except Exception as e:
        job_store[job_id] = {
            "status": "failed",
            "error": str(e)
        }

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_prompt = data['prompt']
    job_id = str(uuid.uuid4())[:8]

    job_store[job_id] = {
        "status": "pending"
    }

    # Start the generation in a background thread
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
    app.run(debug=True, use_reloader=False)


