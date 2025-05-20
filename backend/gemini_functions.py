import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

def safety_check(prompt):
    safety_prompt = f"""
    

    """
