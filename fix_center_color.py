import cv2
import numpy as np
from PIL import Image

# Target background color from the video frames (BGR)
TARGET_BG_BGR = np.array([11, 13, 235], dtype=np.uint8)   # #eb0d0b in BGR

# Load character_image.png
img = cv2.imread("public/character_image.png")
h, w = img.shape[:2]

print(f"Image size: {w}x{h}")

# Sample existing background color from corners
corner_samples = [
    img[10, 10],
    img[10, w - 10],
    img[h // 2, 10],
    img[h // 2, w - 10],
    img[50, 50],
    img[50, w - 50],
]
sample_colors = np.array(corner_samples)
src_bg_bgr = np.median(sample_colors, axis=0).astype(np.uint8)
print(f"Detected source BG (BGR): {src_bg_bgr} -> #{src_bg_bgr[2]:02x}{src_bg_bgr[1]:02x}{src_bg_bgr[0]:02x}")
print(f"Target BG       (BGR): {TARGET_BG_BGR} -> #{TARGET_BG_BGR[2]:02x}{TARGET_BG_BGR[1]:02x}{TARGET_BG_BGR[0]:02x}")

# Create a mask for pixels that are "background-like"
# Background is pure red: high R, low G, low B
img_f = img.astype(np.float32)

# Heuristic: background pixels have R channel (index 2 in BGR) much higher than G and B
r = img_f[:, :, 2]
g = img_f[:, :, 1]
b = img_f[:, :, 0]

# Background mask: red dominant, relatively low green and blue
bg_mask = (r > 160) & (g < 60) & (b < 60)

# Erode mask slightly to avoid bleeding into character edges
kernel = np.ones((3, 3), np.uint8)
bg_mask_u8 = bg_mask.astype(np.uint8) * 255
bg_mask_eroded = cv2.erode(bg_mask_u8, kernel, iterations=2)

# Replace background pixels with exact target color
result = img.copy()
result[bg_mask_eroded > 0] = TARGET_BG_BGR

# Create a smooth alpha-blended transition at the edges
# Dilate to find edge pixels
bg_mask_dilated = cv2.dilate(bg_mask_eroded, kernel, iterations=3)
edge_mask = (bg_mask_dilated > 0) & (bg_mask_eroded == 0)

# For edge pixels: blend between original and target based on how "red" they are
edge_pixels = result[edge_mask].astype(np.float32)
orig_edge = img[edge_mask].astype(np.float32)

# Blend factor: how much of the original was background-colored
er = orig_edge[:, 2]
eg = orig_edge[:, 1]
eb = orig_edge[:, 0]
edge_redness = np.clip((er - 160) / 95.0, 0, 1) * np.clip((60 - eg) / 60.0, 0, 1)

target_f = TARGET_BG_BGR.astype(np.float32)
blended = orig_edge * (1 - edge_redness[:, None]) + target_f[None, :] * edge_redness[:, None]
result[edge_mask] = np.clip(blended, 0, 255).astype(np.uint8)

# Save as WebP to public/frames/center.webp for seamless integration
webp_params = [cv2.IMWRITE_WEBP_QUALITY, 96]
cv2.imwrite("public/frames/center_corrected.webp", result, webp_params)
cv2.imwrite("public/character_image_corrected.png", result)

# Verify background color after fix
corners_after = [result[10, 10], result[10, w-10], result[h//2, 10], result[h//2, w-10]]
after_bg = np.median(corners_after, axis=0).astype(int)
print(f"Result BG (BGR): {after_bg} -> #{after_bg[2]:02x}{after_bg[1]:02x}{after_bg[0]:02x}")
print("Saved: public/character_image_corrected.png and public/frames/center_corrected.webp")
