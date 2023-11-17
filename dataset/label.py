import os
import cv2
import pandas as pd
import numpy as np
from cvzone.HandTrackingModule import HandDetector

DATA_DIR = './'
detector = HandDetector(maxHands=1, detectionCon=0.3)


columns = [f'{axis}{i}' for i in range(21) for axis in ['x', 'y', 'z']]
columns.append('label')
df = pd.DataFrame(columns=columns)


for split in os.listdir(DATA_DIR)[:2] :
    for word in os.listdir(os.path.join(DATA_DIR, split)):
        for img_path in os.listdir(os.path.join(split, word)):
            img = cv2.imread(os.path.join(DATA_DIR, split, word, img_path))
            hands, _ = detector.findHands(img, flipType=True)
            
            if hands:
                points = hands[0]["lmList"]
                points = np.reshape(points, (1,-1))[0]
                points = np.append(points, word)

                row = dict(zip(df.columns, points.tolist()))
                df.loc[len(df)] = row
            else:
                print(img_path + ' was deleted.')  
                os.remove(os.path.join(DATA_DIR, split, word, img_path))
                
            # cv2.imshow('cu', img)
            # cv2.waitKey(0)
            
    df.to_csv(split+'.csv', index=False)
    df = pd.DataFrame(columns=columns)
    print(split + '\n')

            
            
                