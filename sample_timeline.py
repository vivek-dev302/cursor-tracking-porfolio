import cv2
import numpy as np
import os

video_path = "public/character.mp4"
cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

os.makedirs("scratch/frames_sample", exist_ok=True)

step = 10 # sample every 10 frames
for f_idx in range(0, total_frames, step):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
    ret, frame = cap.read()
    if ret:
        # Resize to smaller preview
        preview = cv2.resize(frame, (320, 180))
        cv2.putText(preview, f"F:{f_idx}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.imwrite(f"scratch/frames_sample/frame_{f_idx:03d}.jpg", preview)

print(f"Sampled frames saved to scratch/frames_sample")
cap.release()
