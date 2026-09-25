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

total_f = len(all_frames)
print(f"Loaded {total_f} frames.")

output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)

# 8 compass anchors in clockwise order starting from RIGHT (0°):
# 0° (0 rad): RIGHT = 108
# 45° (pi/4): DOWN-RIGHT = 148
# 90° (pi/2): DOWN = 172
# 135° (3pi/4): DOWN-LEFT = 212
# 180° (pi): LEFT = 244
# 225° (5pi/4): UP-LEFT = 268
# 270° (3pi/2): UP = 278 / 50 (seam)
# 315° (7pi/4): UP-RIGHT = 76
# 360°: RIGHT = 108

# Notice from 268 (UP-LEFT) -> 278 (UP) -> 50 (UP) -> 76 (UP-RIGHT):
# We can blend frames smoothly across 276..280 and 48..54 to make the UP transition 100% seamless!

# Let's define the continuous trajectory of video frames for 64 output frames (0..63)
# 0..8: 108 -> 148 (RIGHT to DOWN-RIGHT)
# 8..16: 148 -> 172 (DOWN-RIGHT to DOWN)
# 16..24: 172 -> 212 (DOWN to DOWN-LEFT)
# 24..32: 212 -> 244 (DOWN-LEFT to LEFT)
# 32..40: 244 -> 268 (LEFT to UP-LEFT)
# 40..48: 268 -> 278 (UP-LEFT to UP)
# 48..56: 50 -> 76 (UP to UP-RIGHT)
# 56..64: 76 -> 108 (UP-RIGHT to RIGHT)

num_frames = 64
frames_per_octant = 8

final_frames = []

for octant in range(8):
    if octant == 0:
        # RIGHT (108) to DOWN-RIGHT (148)
        f_start, f_end = 108, 148
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 1:
        # DOWN-RIGHT (148) to DOWN (172)
        f_start, f_end = 148, 172
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 2:
        # DOWN (172) to DOWN-LEFT (212)
        f_start, f_end = 172, 212
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 3:
        # DOWN-LEFT (212) to LEFT (244)
        f_start, f_end = 212, 244
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 4:
        # LEFT (244) to UP-LEFT (268)
        f_start, f_end = 244, 268
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 5:
        # UP-LEFT (268) to UP (278 / 50)
        # Smoothly transition from 268 towards 278, and gently blend into 50 at the apex
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            # frame in 268..278
            f1_idx = int(round(268 + t * (278 - 268)))
            # frame in 46..50
            f2_idx = int(round(44 + t * (50 - 44)))
            # blend weights
            blend_w = t * 0.7 # gradually introduce f2
            frame_blended = cv2.addWeighted(all_frames[f1_idx], 1.0 - blend_w, all_frames[f2_idx], blend_w, 0)
            final_frames.append(frame_blended)
    elif octant == 6:
        # UP (50) to UP-RIGHT (76)
        f_start, f_end = 50, 76
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])
    elif octant == 7:
        # UP-RIGHT (76) to RIGHT (108)
        f_start, f_end = 76, 108
        for s in range(frames_per_octant):
            t = s / float(frames_per_octant)
            idx = int(round(f_start + t * (f_end - f_start)))
            final_frames.append(all_frames[idx])

print(f"Generated {len(final_frames)} final frames.")

# Save WebP frames
webp_params = [cv2.IMWRITE_WEBP_QUALITY, 95]
for i, frame in enumerate(final_frames):
    out_file = os.path.join(output_dir, f"frame_{i}.webp")
    cv2.imwrite(out_file, frame, webp_params)

# Center frame (F295)
center_frame = all_frames[295]
cv2.imwrite(os.path.join(output_dir, "center.webp"), center_frame, webp_params)
print("Saved 64 frames and center.webp to public/frames/")

# Verify differences between all 64 consecutive frames
diffs = []
for i in range(num_frames):
    f1 = final_frames[i][0:800, 600:1320].astype(float)
    f2 = final_frames[(i + 1) % num_frames][0:800, 600:1320].astype(float)
    d = np.mean(np.abs(f1 - f2))
    diffs.append((i, (i + 1) % num_frames, d))

max_diff = max(d for _, _, d in diffs)
mean_diff = sum(d for _, _, d in diffs) / len(diffs)
print(f"Frame differences: Mean = {mean_diff:.2f}, Max = {max_diff:.2f}")
