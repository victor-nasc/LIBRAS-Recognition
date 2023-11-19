import cv2
import numpy as np
import joblib
from cvzone.HandTrackingModule import HandDetector
from keras.models import load_model

labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'L', 'M', 'N', 'O', 'P',
       'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y']
eps = 25
cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1, detectionCon=0.3)

model = load_model('your_model.h5')

c = ''
while True:
    # read frame
    ret, frame = cap.read()
    
    # detect hands
    hands, img = detector.findHands(frame,flipType=True)
    
    # if hands are detected
    points = []
    for hand in hands:
        # get landmarks
        land_marks = hand["lmList"]
                    
        # get bouding box 
        x, y, w, h = hand['bbox']
        
        # normalize landmark coordinates
        max_z = max([mark[2] for mark in land_marks])
        min_z = min([mark[2] for mark in land_marks])
        for lx, ly, lz in land_marks:
            x_norm = (lx - x) / w
            y_norm = (ly - y) / h
            z_norm = (lz-min_z) / (max_z - min_z)
            points.extend([x_norm, y_norm, z_norm])
        
        # reshape to 1x63 (model input)
        points = np.reshape(points, (1,-1))[0]
        points = points[np.newaxis, :]
        
        # in all poins are detected
        if(np.shape(points)[1] == 63):
            # predict
            predictions = model.predict(np.asarray(points), verbose=0)
            
            # assign class
            predicted_class = labels[np.argmax(predictions)]
            c = predicted_class     


    cv2.putText(img, c, (50,100), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 255, 0), 5)
        
    cv2.imshow("CU", img)
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
