from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from flask_cors import CORS
from gemini_functions import generate_manim_code
import uuid 
import threading


load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

job_store={}

@app.route("/ping", methods= ["GET"])
def ping():
    return jsonify({"message": "Pinged"}),200

@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Hello World"})

def run_generation_thread(user_prompt, job_id):
    data, status = generate_manim_code(user_prompt, job_id)

    if status == 200:
        job_store[job_id] = {
            "status": "complete",
            "url": data
        }
    else:
        job_store[job_id] = {
            "status": "failed"
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


