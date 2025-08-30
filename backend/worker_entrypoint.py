import os
import google.generativeai as genai
from dotenv import load_dotenv
import time
from flask import jsonify
import shutil
import re
import glob
import subprocess
import sys
import json
import cloudinary
import cloudinary.uploader

load_dotenv()

cloudinary.config( 
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET'), 
    secure=True
)
def upload_doc(file, job_id):
    documentUrl = ""
    try:
        if file:
            object_key = str(time.time()) + "/"+ job_id
            upload_result = cloudinary.uploader.upload(file,public_id=object_key, resource_type = "video")
                
            documentUrl = upload_result["secure_url"]
        else:
            return {
                "message": "Invalid file mime type",
                "error_msg": "error"
            }, 400
        return {"message": "Document uploaded successfully",
                "document_url": documentUrl,
            },200
    except Exception as e:
        return {
            "message": "some error occurred",
            "error": str(e)
        },500

def run_manim_script(code_dir, media_dir):
    """Run Manim script and return success status."""
    manim_cmd = [
        "manim",
        "-ql", 
        f"{code_dir}/main.py",
        "--log_to_file",
        "--disable_caching",
        "--media_dir",
        media_dir
    ]

    try:
        print(f"Running Manim command: {' '.join(manim_cmd)}")
        result = subprocess.run(
            manim_cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=240 # 5 minute timeout
        )
        print("Manim execution successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Manim execution failed")
        return False
    except subprocess.TimeoutExpired:
        print("Manim execution timed out")
        return False

def find_video_file(media_dir):
    video_pattern = os.path.join(media_dir, "videos/main/480p15/*.mp4")
    video_files = glob.glob(video_pattern)
    
    if not video_files:
        return None
    
    return max(video_files, key=os.path.getmtime)

def main():
    """Main worker function."""
    job_id = os.getenv('JOB_ID')
    code = os.getenv('CODE')
    
    if not job_id or not code:
        print("Missing required environment variables: JOB_ID or CODE", file=sys.stderr)
        sys.exit(1)

    print(f"Starting job {job_id}")
    
    # Setup directories
    job_dir = f"/tmp/{job_id}"
    media_dir = f"{job_dir}/media"
    code_dir = f"{job_dir}/code"
    
    os.makedirs(media_dir, exist_ok=True)
    os.makedirs(code_dir, exist_ok=True)

    try:
        # Write the code to main.py
        code_path = f"{code_dir}/main.py"
        with open(code_path, "w") as f:
            f.write(code)
        
        print(f"Code written to {code_path}")
        
        
        # Run Manim
        print("Starting Manim execution...")
        success = run_manim_script(code_dir, media_dir)
        
        if not success:
            print("Manim execution failed", file=sys.stderr)
            sys.exit(1)
        
        # Find the generated video
        video_file = find_video_file(media_dir)
        if not video_file:
            print("No video file found", file=sys.stderr)
            sys.exit(1)
        
        print(f"Video generated: {video_file}")
        
        # Upload to Cloudinary
        print("Uploading to Cloudinary...")
        res, status = upload_doc(video_file, job_id)
        cloudinary_url = res['document_url']
        
        if not cloudinary_url:
            print("Failed to upload to Cloudinary", file=sys.stderr)
            sys.exit(1)
        
        result = {
            "status": "success",
            "job_id": job_id,
            "url": cloudinary_url,
            "code": code,
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "status": "error",
            "job_id": job_id,
            "error": str(e),
            "code": code
        }
        print(json.dumps(error_result), file=sys.stderr)
        sys.exit(1)
    
    finally:
        if os.path.exists(job_dir):
            shutil.rmtree(job_dir)
            print(f"Cleaned up job directory: {job_dir}")

if __name__ == "__main__":
    main()
