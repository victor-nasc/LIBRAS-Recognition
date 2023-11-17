import cv2
from cvzone.HandTrackingModule import HandDetector

eps = 25
cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1, detectionCon=0.3)

while True:
    ret, frame = cap.read()
    hands, img = detector.findHands(frame,flipType=True)
    
    for hand in hands:
        x,y,w,h = hand['bbox']
        y0 = max(0, y-eps)
        y1 = min(img.shape[0], y+h+eps)
        x0 = max(0, x-eps)
        x1 = min(img.shape[1], x+w+eps)
        crop = img[y0:y1 , x0:x1]   
        # cv2.imshow("Cu2", crop)

        
    cv2.imshow("CU", img)
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
