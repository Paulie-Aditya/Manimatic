import os
import google.generativeai as genai
from dotenv import load_dotenv
from helper import upload_doc
import time
from flask import jsonify
import time
import shutil
import re
import glob
import subprocess

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')


def extract_explanation_and_code(response):
    code_match = re.search(r"```python(.*?)```", response, re.DOTALL)
    if code_match:
        code = code_match.group(1).strip()
        explanation_before = response[:code_match.start()].strip()
        explanation_after = response[code_match.end():].strip()
        explanation = explanation_before + "\n\n" + explanation_after if explanation_before or explanation_after else ""
    else:
        code = ""
        explanation = response.strip()
    return explanation.strip(), code

def safety_check(user_prompt):
    return
    # high severity, needs to be resolved before launch

def run_manim_script(code_dir, media_dir):
    manim_cmd = [
        "manim",
        "-ql",
        f"{code_dir}/main.py",
        "--log_to_file",
        "--disable_caching",
        "--media_dir",
        media_dir
    ]

    # print("Running:", " ".join(manim_cmd))

    try:
        result = subprocess.run(
            manim_cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        # print("Manim stdout:\n", result.stdout.decode())
        # print("Manim stderr:\n", result.stderr.decode())
    except subprocess.CalledProcessError as e:
        # print("Error running Manim:", e.stderr.decode())
        raise RuntimeError("Manim execution failed") from e

def generate_manim_code(user_prompt, job_id):
    job_dir = f"./jobs/{job_id}"
    media_dir = f"{job_dir}/media"
    logs_dir = f"{media_dir}/logs"
    code_dir = f"{job_dir}/code"

    os.makedirs(logs_dir, exist_ok=True)
    os.makedirs(code_dir, exist_ok=True)

    prompt = f'''
    {user_prompt}
    
    You are a code generation assistant. Generate **valid and executable Manim Python code** for an animation based on the prompt above.

    Instructions:
    - Use official Manim syntax from https://docs.manim.community.
    - Output must include:
    1. **Python Code** in a Markdown block (use triple backticks with ```python).
    - Start code with required imports like `from manim import *`
    - Define a class named 'Animation' that inherits from 'Scene' or a relevant Scene subclass.
    - Implement a 'construct' method containing the animation logic.
    - All code should be self-contained (no external assets).
    2. **Context or Explanation** (natural language text about the prompt given by user).
    '''
    
    response = model.generate_content(prompt).text
    explanation, code = extract_explanation_and_code(response)

    code_path = f"{code_dir}/main.py"
    with open(code_path, "w") as file:
        file.write(code)
    start_time = time.time()
    log_file = f"{logs_dir}/main_Animation.log"
    with open(log_file, "w") as f:
        pass
    try:
        run_manim_script(code_dir, media_dir)
    except:
        return None, explanation, code ,500

    while True:
        curr_time = time.time()
        time_taken = curr_time-start_time
        if(time_taken > 60):
            # two mins taken
            return None, explanation, code,500
        try:
            with open(log_file, "r") as f:
                data = f.read()
                if(len(data) > 0):
                    pass
                else:
                    time.sleep(1)
                    continue
                data = data.split("\n")
                for curr in data:
                    # print(curr)
                    curr = eval(curr)
                    if curr["module"] == "file_ops" or curr["module"] == "scene":
                        break
                    else:
                        time.sleep(1)
                        continue
                break
        except:
            time.sleep(1)
            continue

    video_files = glob.glob(os.path.join(media_dir, "videos/main/480p15/*.mp4"))
    if not video_files:
        return None, explanation, code ,500
        raise FileNotFoundError("No MP4 file found in the expected output folder.")
    video_file = max(video_files, key=os.path.getmtime)
    res, status = upload_doc(video_file, job_id)
    if os.path.exists(job_dir) and os.path.isdir(job_dir):
        shutil.rmtree(job_dir)
    if status == 200 :
        return res['document_url'], explanation, code, 200
    else:
        return None, explanation, None,status
    
