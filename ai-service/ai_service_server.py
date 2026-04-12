import os
import io
import time
import base64
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from gradio_client import Client, handle_file
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("IDMVTON_Server")

app = FastAPI(title="Local IDM-VTON Proxy Server")

# Check for the Colab Gradio URL in the environment
# Make sure to set this in your Virtual_tryon/ai-service/.env File!
COLAB_URL = os.environ.get("COLAB_GRADIO_URL", "")

if not COLAB_URL:
    logger.warning("⚠️ COLAB_GRADIO_URL is missing! Requests will fail until you provide the Colab Ngrok/Gradio link.")

@app.post("/tryon")
async def process_tryon(user: UploadFile = File(...), cloth: UploadFile = File(...)):
    if not COLAB_URL:
        raise HTTPException(status_code=500, detail="Colab Server URL not configured. Paste the gradio link in your .env file as COLAB_GRADIO_URL.")
    
    logger.info("Received try-on request. Forwarding to Colab...")
    
    try:
        # Save uploaded files temporarily to pass to gradio_client
        user_ext = user.filename.split(".")[-1] if "." in user.filename else "jpg"
        cloth_ext = cloth.filename.split(".")[-1] if "." in cloth.filename else "jpg"
        
        user_path = f"temp_user.{user_ext}"
        cloth_path = f"temp_cloth.{cloth_ext}"
        
        with open(user_path, "wb") as f:
            f.write(await user.read())
            
        with open(cloth_path, "wb") as f:
            f.write(await cloth.read())
        
        # Connect to the remote IDM-VTON Gradio App
        logger.info(f"Connecting to remote Gradio Server at {COLAB_URL} ...")
        client = Client(COLAB_URL)
        
        # Process Inference
        result = client.predict(
            dict={"background": handle_file(user_path), "layers": [], "composite": None},
            garm_img=handle_file(cloth_path),
            garment_des="Virtual Try On",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        
        # Result is typically a tuple or path. The first element is the output image.
        output_image_path = result[0] if isinstance(result, (list, tuple)) else result
        
        logger.info("✅ Generation complete! Returning to Dashboard.")
        
        with open(output_image_path, "rb") as bf:
            image_bytes = bf.read()
            encoded_image = base64.b64encode(image_bytes).decode('utf-8')
            
        # Cleanup temp
        os.remove(user_path)
        os.remove(cloth_path)
            
        return JSONResponse(content={"status": "success", "image": encoded_image})
        
    except Exception as e:
        logger.error(f"Try-On Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
