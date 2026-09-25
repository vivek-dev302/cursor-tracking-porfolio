import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
all_frames = []

idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
    idx += 1

cap.release()
print(f"Total read frames: {len(all_frames)}")

# Save rotation analysis sheet (frames 40 to 280, step 4)
frames_rot = []
for f in range(40, min(285, len(all_frames)), 4):
    head = all_frames[f][0:800, 600:1320]
    thumb = cv2.resize(head, (160, 180))
    cv2.putText(thumb, str(f), (8, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    frames_rot.append(thumb)

cols = 12
rows = []
for i in range(0, len(frames_rot), cols):
    chunk = frames_rot[i:i+cols]
    while len(chunk) < cols:
        chunk.append(np.zeros_like(frames_rot[0]))
    rows.append(np.hstack(chunk))
sheet = np.vstack(rows)
cv2.imwrite("scratch/rotation_analysis.jpg", sheet)
print("Saved scratch/rotation_analysis.jpg")

# Also save neutral frames from end: 280..298
frames_end = []
for f in range(275, len(all_frames)):
    head = all_frames[f][0:800, 600:1320]
    thumb = cv2.resize(head, (160, 180))
    cv2.putText(thumb, str(f), (8, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    frames_end.append(thumb)
if frames_end:
    cols = 8
    rows = []
    for i in range(0, len(frames_end), cols):
        chunk = frames_end[i:i+cols]
        while len(chunk) < cols:
            chunk.append(np.zeros_like(frames_end[0]))
        rows.append(np.hstack(chunk))
    sheet_end = np.vstack(rows)
    cv2.imwrite("scratch/neutral_end.jpg", sheet_end)
    print("Saved scratch/neutral_end.jpg")
