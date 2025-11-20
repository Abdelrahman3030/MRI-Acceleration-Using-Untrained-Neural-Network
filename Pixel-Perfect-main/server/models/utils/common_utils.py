from PIL import Image

def crop_image(img_pil):
    """
    Crop image if needed to ensure proper processing
    """
    # Convert to RGB if in RGBA mode
    if img_pil.mode == 'RGBA':
        img_pil = img_pil.convert('RGB')
    
    return img_pil
