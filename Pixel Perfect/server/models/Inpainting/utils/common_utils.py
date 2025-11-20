from PIL import Image
import numpy as np

def load_image(path):
    image = Image.open(path)
    return image 

def get_image(image_path, target_size=-1):
    """
    Load an image and resize it if a target size is specified.
    
    Args:
        image_path: The file path to the image.
        target_size: Tuple or scalar for target dimensions; 
                     if -1, no resizing is applied.
    
    Returns:
        image: The loaded (and resized, if applicable) PIL Image object.
    """
    
    # Step 1: Load the image
    image = Image.open(image_path)
    
    # Step 2: Handle target_size input (convert scalar to tuple if necessary)
    if isinstance(target_size, int):
        target_size = (target_size, target_size)
    
    # Step 3: Check if resizing is needed
    should_resize = target_size[0] != -1 and target_size != image.size
    
    if should_resize:
        # Step 4: Choose appropriate resizing method based on size comparison
        resample_method = Image.BICUBIC if target_size[0] > image.size[0] else Image.ANTIALIAS
        
        # Step 5: Resize the image
        image = image.resize(target_size, resample_method)
    
    # Convert the image to a NumPy array if needed (can add the code here)
    image_np = pil_to_np(image)

    # Step 6: Return the image
    return image,image_np 


def crop_image(image, divisor=32):
    """
    Crops the image so that its dimensions are divisible by the given divisor.
    
    Args:
        image: A PIL Image object to be cropped.
        divisor: The number by which the image dimensions should be divisible (default is 32).
    
    Returns:
        Cropped image with dimensions that are multiples of the divisor.
    """
    
    # Calculate new dimensions that are divisible by the divisor
    width, height = image.size
    new_width = width - (width % divisor)
    new_height = height - (height % divisor)
    
    # Determine the crop box to center the crop
    left = (width - new_width) // 2
    top = (height - new_height) // 2
    right = left + new_width
    bottom = top + new_height

    # Crop the image using the calculated box
    cropped_image = image.crop((left, top, right, bottom))
    
    return cropped_image

