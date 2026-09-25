import cv2
import numpy as np

# Let's inspect frames around key transitions
cap = cv2.VideoCapture("public/character.mp4")

# Let's export 1-frame-stepped contact sheets for:
# 1. Start of rotation: 40 to 90
# 2. Right to Down: 90 to 180
# 3. Down to Left: 180 to 260
# 4. Left to Up to Center: 260 to 298
# 5. Neutral frames: 0 to 40 and 290 to 298

def save_range_sheet(start, end, step, outfile, cols=10):
    frames = []
    for f in range(start, end + 1, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ret, frame = cap.read()
        if not ret:
            break
        # Crop to head region to see directions very clearly (center x: 400..1520, y: 0..800)
        head = frame[0:800, 600:1320]
        thumb = cv2.resize(head, (180, 200))
        cv2.putText(thumb, str(f), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        frames.append(thumb)
    
    rows = []
    for i in range(0, len(frames), cols):
        chunk = frames[i:i+cols]
        while len(chunk) < cols:
            chunk.append(np.zeros_like(frames[0]))
        rows.append(np.hstack(chunk))
    
    sheet = np.vstack(rows)
    cv2.imwrite(outfile, sheet)
    print(f"Saved {outfile}")

save_range_sheet(40, 290, 4, "scratch/rotation_analysis.jpg", cols=12)
save_range_sheet(0, 45, 3, "scratch/neutral_start.jpg", cols=8)
save_range_sheet(280, 298, 1, "scratch/neutral_end.jpg", cols=10)

cap.release()
