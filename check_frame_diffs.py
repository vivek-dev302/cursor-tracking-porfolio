import cv2
import numpy as np

# Let's inspect the differences between consecutive frames to check for visual jumps
frames = []
for i in range(64):
    img = cv2.imread(f"public/frames/frame_{i}.webp")
    frames.append(img)

diffs = []
for i in range(64):
    f1 = frames[i]
    f2 = frames[(i + 1) % 64]
    # compute mean absolute difference in head region
    head1 = f1[0:800, 600:1320].astype(float)
    head2 = f2[0:800, 600:1320].astype(float)
    diff = np.mean(np.abs(head1 - head2))
    diffs.append((i, (i + 1) % 64, diff))

print("Frame to Frame differences:")
for i, j, d in diffs:
    bar = "#" * int(d)
    print(f"Frame {i:02d} -> {j:02d}: diff = {d:5.2f} {bar}")
