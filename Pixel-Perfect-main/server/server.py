from flask import Flask, request, jsonify, send_file
from io import BytesIO
from PIL import Image
import os
import sys
import importlib.util
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://192.168.56.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def load_model(model_name):
    try:
        # Get the absolute path to the server directory
        server_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Add models directory to Python path
        models_dir = os.path.join(server_dir, 'models')
        if models_dir not in sys.path:
            sys.path.append(models_dir)
        
        if model_name == 'inpainting':
            from Inpainting.inpainting import DemoModel
        elif model_name == 'denoising':
            from Denoising.denoising import DemoModel
        elif model_name == 'superresolution':
            from SuperResolution.superresolution import DemoModel
        elif model_name == 'mri':
            from Mri.mri import DemoModel
        else:
            raise Exception(f"Unknown model type: {model_name}")
            
        return DemoModel
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise Exception(f"Failed to load {model_name} model: {str(e)}")

def validate_image(file):
    try:
        img = Image.open(file.stream)
        # Validate image format
        if img.format not in ['JPEG', 'PNG', 'BMP']:
            return None, "Unsupported image format. Please use JPEG, PNG, or BMP"
        # Reset file stream position
        file.stream.seek(0)
        return img, None
    except Exception as e:
        return None, f"Invalid image file: {str(e)}"

@app.route('/process-image/<model_type>', methods=['POST', 'OPTIONS'])
def process_image(model_type):
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        if model_type not in ['inpainting', 'denoising', 'superresolution', 'mri']:
            return jsonify({"error": "Invalid model type"}), 400
            
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        img_file = request.files['image']
        print(f"Received file: {img_file.filename}")
        
        # Validate image
        img, error = validate_image(img_file)
        if error:
            print(f"Image validation error: {error}")
            return jsonify({"error": error}), 400
        
        try:
            print(f"Loading model: {model_type}")
            # Load and initialize the appropriate model
            ModelClass = load_model(model_type)
            print("Model loaded successfully")
            
            # Handle mask for inpainting
            mask = None
            if model_type == 'inpainting' and 'mask' in request.files:
                mask_file = request.files['mask']
                mask, mask_error = validate_image(mask_file)
                if mask_error:
                    print(f"Mask validation error: {mask_error}")
                    return jsonify({"error": f"Invalid mask: {mask_error}"}), 400
            
            print("Initializing model with image")
            model = ModelClass(img_pil=img, mask_pil=mask) if model_type == 'inpainting' else ModelClass(img_pil=img)
            print("Model initialized successfully")
            
            # Process the image
            print("Processing image")
            processed_img = model.process_image()
            print("Image processed successfully")
            
            # Save the processed image to BytesIO
            img_io = BytesIO()
            processed_img.save(img_io, 'PNG')
            img_io.seek(0)
            
            # Return the processed image directly
            return send_file(img_io, mimetype='image/png')
            
        except Exception as e:
            import traceback
            error_msg = f"Error during processing: {str(e)}\nTraceback: {traceback.format_exc()}"
            print(error_msg)
            return error_msg, 500
            
    except Exception as e:
        import traceback
        error_msg = f"Server error: {str(e)}\nTraceback: {traceback.format_exc()}"
        print(error_msg)
        return error_msg, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
