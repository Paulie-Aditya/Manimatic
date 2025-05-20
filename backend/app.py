from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
from flask_cors import CORS
from gemini_functions import generate_manim_code

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/ping", methods= ["GET"])
def ping():
    return jsonify({"message": "Pinged"}),200

@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Hello World"})

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_prompt = data['user_prompt']
    # add auth later (jwt/firebase)
    res, status = generate_manim_code(user_prompt)
    if(status == 200):
        return jsonify({"message":"Success", "url":res}), 200
    else:
        return {"message":"some error occured"},status

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)


