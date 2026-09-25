import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
all_frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
cap.release()

# Let's inspect frames around 45..55 and 270..285
matches = []
for start_f in range(40, 60):
    for end_f in range(270, 285):
        f1 = all_frames[end_f][0:800, 600:1320].astype(float)
        f2 = all_frames[start_f][0:800, 600:1320].astype(float)
        d = np.mean(np.abs(f1 - f2))
        matches.append((d, end_f, start_f))

matches.sort()
for d, end_f, start_f in matches[:10]:
    print(f"Diff: {d:5.2f} | End Frame {end_f} -> Start Frame {start_f}")
