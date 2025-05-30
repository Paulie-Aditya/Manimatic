import os
import google.generativeai as genai
from dotenv import load_dotenv
from helper import upload_doc
import time
from flask import jsonify

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

def generate_manim_code(user_prompt):
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
    '''
    
    response = model.generate_content(prompt).text
    # response will be generating in the following format: ```python {actual text}```
    response = response.strip("```python ").lstrip().rstrip().rstrip("```")
    with open("./my-project/main.py", "w") as file:
        file.write(response)
    # this has to be saved to main.py and then run `manim -pql main.py`
    log_file = "./media/logs/main_Animation.log"
    # clear out log file before execution 
    with open(log_file, "w") as f:
        pass
    
    os.system("manim -ql my-project/main.py --log_to_file")
    while True:
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

    #once done
    file = "media/videos/main/480p15/Animation.mp4"
    res, status = upload_doc(file)
    if status == 200 :
        return res['document_url'],200
    else:
        return {"message":"some error occured"},status

# print(generate_manim_code("generate an animation of a square changing into a circle and then into a rectangle"))

# print(generate_manim_code("Generate an animation of a ball on a number line (1 to 100) going from 1 to 100 in increments of 1 then once the ball reaches 100, start over with increments of 3 continue this for all odd numbers upto 100, then once done, show increments of all even numbers"))