import cv2
import numpy as np

# Let's create a combined contact sheet of all sampled frames (e.g., every 5 frames: 60 frames)
# so we can see the exact motion timeline clearly.
cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

rows = []
cur_row = []

for f in range(0, total_frames, 5):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if not ret:
        break
    thumb = cv2.resize(frame, (160, 90))
    cv2.putText(thumb, str(f), (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cur_row.append(thumb)
    if len(cur_row) == 10:
        rows.append(np.hstack(cur_row))
        cur_row = []

if cur_row:
    while len(cur_row) < 10:
        cur_row.append(np.zeros((90, 160, 3), dtype=np.uint8))
    rows.append(np.hstack(cur_row))

contact_sheet = np.vstack(rows)
cv2.imwrite("scratch/contact_sheet.jpg", contact_sheet)
print(f"Contact sheet saved, shape: {contact_sheet.shape}")
cap.release()
