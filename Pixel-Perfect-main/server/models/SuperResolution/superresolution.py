from .utils.common_utils import crop_image, pil_to_np
from PIL import Image, ImageFilter, ImageEnhance

class DemoModel:
    def __init__(self, img_pil):
        self.img_pil = crop_image(img_pil)
        self.img_np = pil_to_np(self.img_pil)

    def process_image(self):
        try:
            # Log input image details
            print(f"Input image mode: {self.img_pil.mode}")
            print(f"Input image size: {self.img_pil.size}")
            
            # Convert to RGB if not already
            if self.img_pil.mode != 'RGB':
                print(f"Converting image from {self.img_pil.mode} to RGB")
                self.img_pil = self.img_pil.convert('RGB')
            
            # Enhance the image
            enhancer = ImageEnhance.Sharpness(self.img_pil)
            sharpened = enhancer.enhance(2.0)  # Increase sharpness
            
            enhancer = ImageEnhance.Contrast(sharpened)
            contrasted = enhancer.enhance(1.2)  # Slightly increase contrast
            
            # Apply subtle smoothing
            processed_img = contrasted.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
            
            print("Image processing completed successfully")
            return processed_img
            
        except Exception as e:
            print(f"Error in process_image: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            raise


if __name__ == "__main__":
    # example usage
    import os
    from PIL import Image

    img_path = './data/snail.jpg'
    image = Image.open(img_path)

    model = DemoModel(image)
    processed_img = model.process_image()
    processed_img.save(os.path.join("./data", "processed_snail.jpg"))
