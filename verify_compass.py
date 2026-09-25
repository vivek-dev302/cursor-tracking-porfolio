import cv2
import numpy as np

# Let's verify the exact frames for the 8 compass directions
# Let's save a collage of the 8 compass directions + center to verify visual accuracy

cap = cv2.VideoCapture("public/character.mp4")
all_frames = []
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames.append(frame)
cap.release()

# Let's define the 8 anchors (angle in degrees from RIGHT going clockwise: 0=RIGHT, 45=DR, 90=DOWN, 135=DL, 180=LEFT, 225=UL, 270=UP, 315=UR)
anchors = {
    "RIGHT (0°)": 108,
    "DOWN-RIGHT (45°)": 148,
    "DOWN (90°)": 172,
    "DOWN-LEFT (135°)": 212,
    "LEFT (180°)": 244,
    "UP-LEFT (225°)": 268,
    "UP (270°)": 52,
    "UP-RIGHT (315°)": 76,
    "CENTER (neutral)": 295
}

compass_thumbs = []
for name, f_idx in anchors.items():
    head = all_frames[f_idx][0:800, 600:1320]
    thumb = cv2.resize(head, (200, 220))
    cv2.putText(thumb, f"{name}: F{f_idx}", (8, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    compass_thumbs.append(thumb)

# Arrange in 3x3 grid
grid = np.vstack([
    np.hstack([compass_thumbs[5], compass_thumbs[6], compass_thumbs[7]]), # UL, UP, UR
    np.hstack([compass_thumbs[4], compass_thumbs[8], compass_thumbs[0]]), # LEFT, CENTER, RIGHT
    np.hstack([compass_thumbs[3], compass_thumbs[2], compass_thumbs[1]])  # DL, DOWN, DR
])

cv2.imwrite("scratch/compass_test.jpg", grid)
print("Compass test grid saved to scratch/compass_test.jpg")
