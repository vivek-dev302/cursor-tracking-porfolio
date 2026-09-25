import cv2
import numpy as np
import os

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

# 8 intervals:
# 0: RIGHT (108) -> DOWN-RIGHT (148)
# 1: DOWN-RIGHT (148) -> DOWN (172)
# 2: DOWN (172) -> DOWN-LEFT (212)
# 3: DOWN-LEFT (212) -> LEFT (244)
# 4: LEFT (244) -> UP-LEFT (268)
# 5: UP-LEFT (268) -> UP (278)
# 6: UP (52) -> UP-RIGHT (76)
# 7: UP-RIGHT (76) -> RIGHT (108)

interval_ranges = [
    (108, 148),
    (148, 172),
    (172, 212),
    (212, 244),
    (244, 268),
    (268, 278),
    (52, 76),
    (76, 108)
]

num_frames = 64
frames_per_octant = 8

extracted_indices = []
for octant, (start_f, end_f) in enumerate(interval_ranges):
    for step in range(frames_per_octant):
        t = step / float(frames_per_octant)
        f_idx = int(round(start_f + t * (end_f - start_f)))
        # For octant 5, avoid blinks at 270-272 by mapping:
        if octant == 5:
            # 268 -> 278 (safe frames: 268, 274, 275, 276, 277, 278)
            safe_seq = [268, 268, 274, 275, 276, 277, 278, 52]
            f_idx = safe_seq[step]
        f_idx = max(0, min(len(all_frames) - 1, f_idx))
        extracted_indices.append(f_idx)

print(f"Final extracted indices ({len(extracted_indices)}):")
print(extracted_indices)

webp_params = [cv2.IMWRITE_WEBP_QUALITY, 94]

for i, f_idx in enumerate(extracted_indices):
    frame = all_frames[f_idx]
    out_file = os.path.join(output_dir, f"frame_{i}.webp")
    cv2.imwrite(out_file, frame, webp_params)

# Center frame (Frame 295)
center_frame = all_frames[295]
cv2.imwrite(os.path.join(output_dir, "center.webp"), center_frame, webp_params)
print("Saved 64 frames and center.webp to public/frames/")

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
cv2.imwrite("scratch/all_64_frames_perfect.jpg", sheet64)
print("Saved scratch/all_64_frames_perfect.jpg")
