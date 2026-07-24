import os
from PIL import Image
import glob

vibe_dir = 'img/vibe'
for img_path in glob.glob(os.path.join(vibe_dir, '*.jpg')):
    try:
        with Image.open(img_path) as img:
            # Convert RGBA to RGB if needed before saving as JPEG/WebP
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # WebP supports RGBA natively, but just in case
                pass
                
            img.thumbnail((600, 600))
            
            base_name = os.path.splitext(img_path)[0]
            webp_path = base_name + '.webp'
            
            img.save(webp_path, 'WEBP', quality=80)
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

print("Conversion complete.")
