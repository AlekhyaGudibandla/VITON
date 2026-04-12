"""
AI Service for Virtual Try-On using IDM-VTON.
Provides /api/tryon endpoint that generates photorealistic
virtual try-on images using the IDM-VTON diffusion model.
"""

import os
import io
from flask import Flask, request, jsonify, send_file
from PIL import Image
from idm_vton_service import IDMVTONPipeline

app = Flask(__name__)

# Initialize the IDM-VTON pipeline eagerly at module level
print("\nInitializing IDM-VTON pipeline...")
pipeline = IDMVTONPipeline()


@app.route('/api/health', methods=['GET'])
def health():
    connected = pipeline.client is not None
    return jsonify({
        'status': 'ok' if connected else 'degraded',
        'model': 'IDM-VTON',
        'connected': connected,
        'mode': 'huggingface-space',
        'description': 'Real AI virtual try-on using IDM-VTON diffusion model'
    })


@app.route('/api/tryon', methods=['POST'])
def tryon():
    """
    Generate a photorealistic virtual try-on image.
    Expects multipart form with 'user_image' and 'clothing_image'.
    Returns the generated JPEG image.
    """
    if 'user_image' not in request.files or 'clothing_image' not in request.files:
        return jsonify({'error': 'Both user_image and clothing_image are required'}), 400

    try:
        # Load images
        user_file = request.files['user_image']
        clothing_file = request.files['clothing_image']

        # Read into bytes first to avoid "cannot identify image file" errors
        # when dealing with SpooledTemporaryFile
        user_bytes = user_file.read()
        clothing_bytes = clothing_file.read()

        user_image = Image.open(io.BytesIO(user_bytes)).convert('RGB')
        clothing_image = Image.open(io.BytesIO(clothing_bytes)).convert('RGB')

        print(f"Received images: user={user_image.size}, clothing={clothing_image.size}")
        print(f"   Pipeline connected: {pipeline.client is not None}")

        try:
            # Generate try-on using IDM-VTON
            print("Generating with IDM-VTON...")
            result_image = pipeline.generate(user_image, clothing_image)
            print(f"Generated try-on result: {result_image.size}")
            
        except RuntimeError as e:
            print(f"Try-on error: {e}")
            return jsonify({'error': str(e)}), 503

        # Return result as JPEG
        img_buffer = io.BytesIO()
        result_image.save(img_buffer, format='JPEG', quality=92)
        img_buffer.seek(0)

        return send_file(
            img_buffer,
            mimetype='image/jpeg',
            as_attachment=False
        )

    # Remove RuntimeError handling, so fallback handles it appropriately

    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Generation failed: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\nAI Service running on port {port}")
    print(f"   Model: IDM-VTON (via HuggingFace Space)")
    print(f"   Pipeline connected: {pipeline.client is not None}")
    print(f"   Endpoint: POST /api/tryon\n")
    app.run(host='0.0.0.0', port=port, debug=False)
