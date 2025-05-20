import cloudinary
import cloudinary.uploader
import os 
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import time
import mimetypes
load_dotenv()

cloudinary.config( 
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET'), 
    secure=True
)

def allowed_files(filename):
    ALLOWED_EXTENSIONS = {'.mp4', '.gif'}
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_doc(file):
    documentUrl = ""
    try:
        # file = "my-project/media/videos/main/480p15/Animation.mp4" # get from manim
        if file:
            object_key = str(time.time()) + "/"+ file
            upload_result = cloudinary.uploader.upload(file,public_id=object_key, resource_type = "video")
                
            documentUrl = upload_result["secure_url"]
        else:
            return {
                "message": "Invalid file mime type",
                "error_msg": str(e)
            }, 400
        return {"message": "Document uploaded successfully",
                "document_url": documentUrl,
            },200
    except Exception as e:
        return {
            "message": "some error occurred",
            "error": str(e)
        },500
