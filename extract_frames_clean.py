import cv2
import numpy as np
import os
import shutil

cap = cv2.VideoCapture("public/character.mp4")
all_frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
cap.release()

output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)

# 8 anchors for 8 octants (0, 45, 90, 135, 180, 225, 270, 315, 360)
# 0° = RIGHT (F108)
# 45° = DOWN-RIGHT (F148)
# 90° = DOWN (F172)
# 135° = DOWN-LEFT (F212)
# 180° = LEFT (F244)
# 225° = UP-LEFT (F268)
# 270° = UP (F52)
# 315° = UP-RIGHT (F76)
# 360° = RIGHT (F108)

anchors = [108, 148, 172, 212, 244, 268, 52, 76, 108]

num_frames = 64
frames_per_octant = num_frames // 8 # 8 frames per octant

extracted_indices = []
for octant in range(8):
    start_f = anchors[octant]
    end_f = anchors[octant + 1]
    for step in range(frames_per_octant):
        t = step / float(frames_per_octant)
        f_idx = int(round(start_f + t * (end_f - start_f)))
        f_idx = max(0, min(len(all_frames) - 1, f_idx))
        extracted_indices.append(f_idx)

print(f"Total extracted frames: {len(extracted_indices)}")
print(f"Indices: {extracted_indices}")

webp_params = [cv2.IMWRITE_WEBP_QUALITY, 94]

for i, f_idx in enumerate(extracted_indices):
    frame = all_frames[f_idx]
    out_file = os.path.join(output_dir, f"frame_{i}.webp")
    cv2.imwrite(out_file, frame, webp_params)

# Center frame (Frame 295)
center_frame = all_frames[295]
cv2.imwrite(os.path.join(output_dir, "center.webp"), center_frame, webp_params)
print("Extracted all 64 frames + center.webp successfully!")

# Build 8x8 contact sheet
thumbs = []
for i in range(num_frames):
    frame = all_frames[extracted_indices[i]]
    head = frame[0:800, 600:1320]
    thumb = cv2.resize(head, (120, 135))
    cv2.putText(thumb, f"{i}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    thumbs.append(thumb)

rows = []
for r in range(8):
    rows.append(np.hstack(thumbs[r*8:(r+1)*8]))
sheet64 = np.vstack(rows)
cv2.imwrite("scratch/all_64_frames_clean.jpg", sheet64)
print("Saved scratch/all_64_frames_clean.jpg")
