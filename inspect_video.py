import cv2
import numpy as np
import os

video_path = "public/character.mp4"
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print(f"Error opening video {video_path}")
    exit(1)

fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video Info:")
print(f"Resolution: {width}x{height}")
print(f"FPS: {fps}")
print(f"Total frames: {total_frames}")
print(f"Duration: {duration:.2f}s")

# Let's inspect background color from corner pixels of first 10 frames
bg_colors = []
for i in range(min(total_frames, 20)):
    ret, frame = cap.read()
    if not ret:
        break
    # sample 4 corners
    corners = [
        frame[5, 5],
        frame[5, width - 6],
        frame[height - 6, 5],
        frame[height - 6, width - 6],
        frame[height // 2, 5],
        frame[height // 2, width - 6]
    ]
    bg_colors.extend(corners)

bg_colors = np.array(bg_colors) # BGR
median_bgr = np.median(bg_colors, axis=0).astype(int)
median_rgb = [int(median_bgr[2]), int(median_bgr[1]), int(median_bgr[0])]
hex_color = "#{:02x}{:02x}{:02x}".format(median_rgb[0], median_rgb[1], median_rgb[2])

print(f"Median Background BGR: {median_bgr}")
print(f"Median Background RGB: {median_rgb}")
print(f"Hex Background: {hex_color}")

cap.release()
