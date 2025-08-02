import os
import google.generativeai as genai
from dotenv import load_dotenv
from helper import upload_doc
import time
from flask import jsonify
import time
import shutil

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

def safety_check(user_prompt):
    return
    # high severity, needs to be resolved before launch
    system_prompt = f"""Generate the manim code for the following prompt, be sure to send back only the code and nothing else, be sure to put it in a class named Animation: {user_prompt}"""
    
    prompt = f"""
    Check if a given prompt is safe to run directly on the operating system. Only respond with PASS if it is unquestionably safe and cannot modify files, execute system commands, or access the network. Respond with FAIL otherwise.
    This is the prompt you have to check: {system_prompt}
    """
    response = model.generate_content(prompt).text
import subprocess

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

    print("Running:", " ".join(manim_cmd))

    try:
        result = subprocess.run(
            manim_cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("Manim stdout:\n", result.stdout.decode())
        print("Manim stderr:\n", result.stderr.decode())
    except subprocess.CalledProcessError as e:
        print("Error running Manim:", e.stderr.decode())
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

    Generate valid and executable Python code for a Manim animation based strictly on the official Manim documentation (https://docs.manim.community). 

    Instructions:
    - Start with all required imports (e.g., 'from manim import *').
    - Define a class named 'Animation' that inherits from 'Scene' or a relevant Scene subclass.
    - Implement a 'construct' method containing the animation logic.
    - Python code can contain explanations, if specified by user (as part of the animation itself, but should be non intrusive and non-overlapping)
    - Do not assume any external assets (e.g., SVGs, images, audio). Everything must be created using Manim primitives, objects, and methods.
    - The code must be fully self-contained, syntactically correct, and ready to run.
    - Do not include explanations, comments, or markdown—only return the raw Python code 
    - NEVER INCLUDE ANY SORT OF EXPLANATION, only the CODE 
    '''
    
    response = model.generate_content(prompt).text
    response = response.strip("```python ").lstrip().rstrip().rstrip("```")
    code_path = f"{code_dir}/main.py"
    with open(code_path, "w") as file:
        file.write(response)
    start_time = time.time()
    log_file = f"{logs_dir}/main_Animation.log"
    with open(log_file, "w") as f:
        pass
    run_manim_script(code_dir, media_dir)

    while True:
        curr_time = time.time()
        print("Current time: ", curr_time)
        time_taken = curr_time-start_time
        print("Time taken till now: ", curr_time-start_time)
        if(time_taken > 120):
            # two mins taken
            return {"message": "some error occured"},500
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
                    print(curr)
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
    video_file = f"{media_dir}/videos/main/480p15/Animation.mp4"
    res, status = upload_doc(video_file, job_id)
    print("Res: ", res)
    print("Status:", status)
    if status == 200 :
        shutil.rmtree(job_dir)
        return res['document_url'],200
    else:
        return {"message":"some error occured"},status
