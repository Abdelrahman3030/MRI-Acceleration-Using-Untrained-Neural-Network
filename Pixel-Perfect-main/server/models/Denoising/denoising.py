import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from utils.common_utils import *
from PIL import Image, ImageFilter, ImageEnhance

class DemoModel:
    def __init__(self, img_pil):
        self.img_pil = crop_image(img_pil)
        
    def process_image(self):
        # Convert to grayscale first
        grayscale = self.img_pil.convert('L')
        
        # Apply denoising using multiple filters for better results
        # First, apply Gaussian blur to reduce noise
        denoised = grayscale.filter(ImageFilter.GaussianBlur(radius=1))
        
        # Apply median filter to remove salt-and-pepper noise
        denoised = denoised.filter(ImageFilter.MedianFilter(size=3))
        
        # Enhance contrast to make black and white more pronounced
        enhancer = ImageEnhance.Contrast(denoised)
        denoised = enhancer.enhance(1.2)  # Increase contrast by 20%
        
        # Apply another round of median filtering to smooth out any artifacts
        denoised = denoised.filter(ImageFilter.MedianFilter(size=3))
        
        return denoised


if __name__ == "__main__":
    # example usage
    import os
    from PIL import Image

    img_path = './data/snail.jpg'
    image = Image.open(img_path)

    model = DemoModel(image)
    processed_img = model.process_image()
    processed_img.save(os.path.join("./data", "processed_snail.jpg"))
