from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
from utils.common_utils import *

class DemoModel:
    def __init__(self, img_pil, mask_pil=None):
        self.img_pil = crop_image(img_pil)
        self.mask_pil = mask_pil
        
    def process_image(self):
        try:
            # Convert images to RGBA
            img = self.img_pil.convert("RGBA")
            
            if self.mask_pil:
                # If mask is provided, use it for inpainting
                mask = self.mask_pil.convert("L")
                
                # Ensure mask and image have the same size
                if mask.size != img.size:
                    mask = mask.resize(img.size)
                
                # Create a new image for the result
                result = Image.new("RGBA", img.size, (0, 0, 0, 0))
                
                # Get image data as numpy arrays
                img_data = np.array(img)
                mask_data = np.array(mask)
                
                # Create an inverse mask for the original image
                inverse_mask = 255 - mask_data
                
                # Apply the mask
                for c in range(4):  # RGBA channels
                    img_data[:, :, c] = img_data[:, :, c] * (inverse_mask / 255.0)
                
                # Convert back to PIL Image
                result = Image.fromarray(img_data)
                
                # Apply some enhancements
                enhancer = ImageEnhance.Contrast(result)
                result = enhancer.enhance(1.2)
                
                enhancer = ImageEnhance.Sharpness(result)
                result = enhancer.enhance(1.1)
                
                return result
            else:
                # If no mask provided, just enhance the image
                enhancer = ImageEnhance.Contrast(img)
                img = enhancer.enhance(1.2)
                
                enhancer = ImageEnhance.Sharpness(img)
                img = enhancer.enhance(1.1)
                
                return img
                
        except Exception as e:
            print(f"Error in inpainting process: {str(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            raise


if __name__ == "__main__":
    # example usage
    import os
    from PIL import Image

    img_path = './data/snail.jpg'
    image = Image.open(img_path)

    # get output path
    directory, filename = os.path.split(img_path)
    output_path = os.path.join(directory, 'output', filename)

    # use model
    model = DemoModel(img_pil=image)
    output_img = model.process_image()

    # save output image
    output_img.save(output_path)

    # MODEL 2
    img_path = './data/vase.png'
    mask_path = './data/vase_mask.png'
    image = Image.open(img_path)
    mask = Image.open(mask_path)

    # get output path
    directory, filename = os.path.split(img_path)
    output_path = os.path.join(directory, 'output', filename)

    # use model
    model = DemoModel(img_pil=image, mask_pil=mask)
    output_img = model.process_image()

    # save output image
    output_img.save(output_path)
