"""
Real AI Virtual Try-On Service.
Connects to the official IDM-VTON Hugging Face Space using Gradio Client.
"""

import os
import time
import logging
import tempfile
import uuid
import shutil
from PIL import Image, ImageOps
import rembg
from gradio_client import Client, handle_file

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("IDMVTONService")

def process_person(image: Image.Image) -> Image.Image:
    """Resize and crop the person image to exactly 768x1024."""
    image = image.convert("RGB")
    return ImageOps.fit(image, (768, 1024), method=Image.Resampling.LANCZOS)

def process_garment(image: Image.Image) -> Image.Image:
    """
    Remove fake backgrounds and perfectly center the garment on a white 768x1024 
    canvas with padded margins. This solves the 'T-pose sleeve hallucination' where 
    edge-to-edge garments get stretched across masked limbs.
    """
    # 1. Strip fake backgrounds using ML
    image = rembg.remove(image)
    
    # 2. Extract tight bounding box of the shirt/dress
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
        
    # 3. Calculate dimension scaling allowing 15% margin padding
    target_w, target_h = 768, 1024
    margin_x, margin_y = int(target_w * 0.15), int(target_h * 0.15)
    
    max_w = target_w - 2 * margin_x
    max_h = target_h - 2 * margin_y
    
    scale = min(max_w / image.width, max_h / image.height)
    new_w, new_h = int(image.width * scale), int(image.height * scale)
    
    image = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 4. Composite over pure white canvas
    bg = Image.new("RGB", (target_w, target_h), (255, 255, 255))
    
    # Handle transparency
    if image.mode in ('RGBA', 'LA'):
        alpha = image.split()[-1]
    else:
        alpha = None
        
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    
    if alpha:
        bg.paste(image, (offset_x, offset_y), mask=alpha)
    else:
        bg.paste(image, (offset_x, offset_y))
        
    return bg

class IDMVTONPipeline:
    """
    Client for the IDM-VTON Hugging Face Space.
    Handles image processing and remote inference calls.
    """

    def __init__(self):
        self.api_url = "yisol/IDM-VTON"
        self.hf_token = os.environ.get("HF_TOKEN")
        logger.info(f"Initializing IDMVTONPipeline with HuggingFace Space: {self.api_url}")
        try:
            self.client = Client(self.api_url, token=self.hf_token)
            logger.info("Connected to HuggingFace Space")
        except Exception as e:
            logger.error(f"Failed to connect to HuggingFace Space: {e}")
            self.client = None

    def generate(self, user_image: Image.Image, clothing_image: Image.Image) -> Image.Image:
        """
        Generate virtual try-on image using the Gradio client.
        """
        if not self.client:
            raise RuntimeError("API Client is not ready. The HuggingFace Space might be down.")

        try:
            # We need to save PIL images to temporary files so handle_file can read them
            temp_dir = tempfile.mkdtemp()
            
            user_path = os.path.join(temp_dir, f"user_{uuid.uuid4().hex}.jpg")
            clothing_path = os.path.join(temp_dir, f"clothing_{uuid.uuid4().hex}.jpg")
            
            user_processed = process_person(user_image)
            clothing_processed = process_garment(clothing_image)
            
            user_processed.save(user_path, format="JPEG", quality=95)
            clothing_processed.save(clothing_path, format="JPEG", quality=95)
            
            logger.info("Sending images to HuggingFace IDM-VTON Space...")
            start = time.time()
            
            # Predict using the named API endpoint
            result = self.client.predict(
                dict(background=handle_file(user_path), layers=[], composite=None),
                handle_file(clothing_path),
                "clothing",  # Simple non-prescriptive constraint
                True,        # is_checked (human bounds matching)
                False,       # is_checked_crop (we already perfectly cropped & padded the garment locally)
                30,          # denoise_steps
                42,          # seed
                api_name="/tryon"
            )
            
            elapsed = time.time() - start
            logger.info(f"Success! Generation took {elapsed:.1f}s")
            
            # The result is typically a tuple: (output_image_path, masked_image_output_path)
            if isinstance(result, tuple) and len(result) > 0:
                output_image_path = result[0]
            elif isinstance(result, str):
                output_image_path = result
            elif isinstance(result, list) and len(result) > 0:
                output_image_path = result[0]
            else:
                logger.error(f"Unexpected response type: {type(result)}")
                output_image_path = result[0] if isinstance(result, (list, tuple)) else result
                
            result_image = Image.open(output_image_path).convert("RGB")
            
            # Cleanup
            shutil.rmtree(temp_dir, ignore_errors=True)
            return result_image
            
        except Exception as e:
            logger.error(f"Tryon Generation failed: {e}")
            raise RuntimeError(f"Hugging Face IDM-VTON error: {e}")

