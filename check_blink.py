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

# Let's inspect frames 255 to 285 one by one to see eye states
thumbs = []
for f in range(255, 286):
    head = all_frames[f][0:800, 600:1320]
    thumb = cv2.resize(head, (160, 180))
    cv2.putText(thumb, f"{f}", (8, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    thumbs.append(thumb)

cols = 8
rows = []
for i in range(0, len(thumbs), cols):
    chunk = thumbs[i:i+cols]
    while len(chunk) < cols:
        chunk.append(np.zeros_like(thumbs[0]))
    rows.append(np.hstack(chunk))

sheet = np.vstack(rows)
cv2.imwrite("scratch/blink_check.jpg", sheet)
print("Saved scratch/blink_check.jpg")
