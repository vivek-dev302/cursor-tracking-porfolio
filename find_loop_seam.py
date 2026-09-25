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

print(f"Total video frames: {len(all_frames)}")

# Calculate consecutive frame differences in original video
diffs_orig = []
for f in range(45, 285):
    f1 = all_frames[f][0:800, 600:1320].astype(float)
    f2 = all_frames[f+1][0:800, 600:1320].astype(float)
    d = np.mean(np.abs(f1 - f2))
    diffs_orig.append((f, f+1, d))

# Also compare frame 278 to frame 50/51/52/53
for start_f in range(45, 55):
    for end_f in range(275, 285):
        f1 = all_frames[end_f][0:800, 600:1320].astype(float)
        f2 = all_frames[start_f][0:800, 600:1320].astype(float)
        d = np.mean(np.abs(f1 - f2))
        if d < 12:
            print(f"Loop seam candidate: End F{end_f} -> Start F{start_f}: diff = {d:.2f}")
