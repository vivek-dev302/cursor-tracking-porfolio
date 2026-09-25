import cv2
import numpy as np
import os
import shutil

video_path = "public/character.mp4"
cap = cv2.VideoCapture(video_path)
all_frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
cap.release()

total_f = len(all_frames)
print(f"Loaded {total_f} frames.")

output_dir = "public/frames"
if os.path.exists(output_dir):
    shutil.rmtree(output_dir)
os.makedirs(output_dir, exist_ok=True)

# Keyframe angle map (Angle in deg -> Video Frame index)
# 0: RIGHT (F108)
# 45: DOWN-RIGHT (F148)
# 90: DOWN (F172)
# 135: DOWN-LEFT (F212)
# 180: LEFT (F244)
# 225: UP-LEFT (F268)
# 270: UP (F278 / F52)
# 315: UP-RIGHT (F76)
# 360: RIGHT (F108)

# Keypoints define intervals: (start_deg, end_deg, start_frame, end_frame)
intervals = [
    (0, 45, 108, 148),
    (45, 90, 148, 172),
    (90, 135, 172, 212),
    (135, 180, 212, 244),
    (180, 225, 244, 268),
    (225, 270, 268, 278), # 278 is UP
    (270, 315, 52, 76),   # 52 is also UP, continuing to 76
    (315, 360, 76, 108)
]

num_frames = 64
deg_step = 360.0 / num_frames # 5.625 deg

extracted_indices = []

for i in range(num_frames):
    target_deg = i * deg_step
    # find corresponding interval
    for start_deg, end_deg, start_f, end_f in intervals:
        if start_deg <= target_deg < end_deg or (i == num_frames - 1 and target_deg >= start_deg):
            t = (target_deg - start_deg) / (end_deg - start_deg)
            f_exact = start_f + t * (end_f - start_f)
            f_idx = int(round(f_exact))
            f_idx = max(0, min(total_f - 1, f_idx))
            extracted_indices.append(f_idx)
            break

print(f"Extracted {len(extracted_indices)} frame indices:")
print(extracted_indices)

# Save the 64 WebP frames
webp_params = [cv2.IMWRITE_WEBP_QUALITY, 92]

for i, f_idx in enumerate(extracted_indices):
    frame = all_frames[f_idx]
    out_file = os.path.join(output_dir, f"frame_{i}.webp")
    cv2.imwrite(out_file, frame, webp_params)

# Save center neutral frame (F295)
center_frame = all_frames[295]
cv2.imwrite(os.path.join(output_dir, "center.webp"), center_frame, webp_params)
print("Saved 64 frames and center.webp to public/frames/")

# Create a 8x8 contact sheet to verify all 64 frames
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
cv2.imwrite("scratch/all_64_frames.jpg", sheet64)
print("Saved scratch/all_64_frames.jpg")
