from flask import Flask, jsonify, request
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()
app = Flask(__name__)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route("/ping", methods= ["GET"])
def ping():
    return jsonify({"message": "Pinged"}),200

@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Hello World"})

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data['prompt']
    # add auth later (jwt/firebase)



if __name__ == '__main__':
    app.run(debug=True)


