import cv2
import numpy as np
import joblib
import argparse

from cvzone.HandTrackingModule import HandDetector
from keras.models import load_model



def main(model):
    # define labels
    labels = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'L', 'M', 
              'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y']

    # open webcam 
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera.")
        exit()
            
    # Get the frame width and height
    text_window_height = 80
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) + text_window_height


    # define hand detector
    detector = HandDetector(maxHands=1, detectionCon=0.5)
    

    # initialize variables
    label = '' 
    text = ''   
    time = time_spacebar = 0
    max_time = 10 # time to wait before adding a new letter to the text
    y = x = w = 0
    font = cv2.FONT_HERSHEY_SIMPLEX


    # define text position    
    text_size = cv2.getTextSize(text, font, 1, 2)[0]
    text_y = (height - text_size[1]) 


    # capture webcam
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break
        
        # add text window
        frame = np.vstack((frame, np.zeros((text_window_height, width, 3), dtype=np.uint8)))
        
        # detect hands
        hands, _ = detector.findHands(frame.copy(), flipType=True)
        
        
        # if the hand was detected
        points = []
        time_spacebar += 1
        if hands: 
            # get landmarks
            hand = hands[0]
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
            
            # predict
            predictions = model.predict(points)
            
            # get label 
            old_label = label
            if np.shape(predictions)[-1] > 1:
                label = labels[np.argmax(predictions)]
            else:
                label = predictions[0]
            
            # update time
            time_spacebar = 0
            if old_label == label:
                time += 1
        else:
            x = y = w = 0


        # add spacebar 
        if time_spacebar > max_time and label != ' ':
            time = max_time+1
            time_spacebar = 0
            label = ' '
            
        # update text
        if time > max_time:
            text += label 
            time = 0
            time_spacebar = 0

            # white blink
            frame = 255 * np.ones((height, width, 3), dtype=np.uint8)
            
            # reset text if it is too big
            text_size = cv2.getTextSize(text, font, 1, 2)[0]
            if text_size[0] > frame.shape[1]//2 - 10:
                text = label
                
                
        # Put the text and label on the window
        ch = label if label != ' ' else '_'
        cv2.putText(frame, 'Press \'Q\' to exit', (10,30), font, 1, (0, 255, 0), 2)
        cv2.putText(frame, 'Press \'C\' to clear', (10,65), font, 1, (0, 255, 0), 2)
        cv2.putText(frame, ch, (x+w//2-22 , y-2*text_size[1]), font, 3, (0, 255, 0), 5)
        cv2.putText(frame, text, (10, text_y), font, 2, (255, 255, 255), 2)


        # display window
        cv2.imshow("Libras Recognition", frame)
        key = cv2.waitKey(1)
        if key == ord('q'):
            break
        elif key == ord('c'):
            text = ''


    # release webcam
    cap.release()
    cv2.destroyAllWindows()



if __name__ == "__main__":
    '''
    Available models: ( use --model=MODEL_NAME )
        - knn
        - rf     (random forest)
        - svm
        - logreg (logistic regression)
        - nn     (neural network)
    '''
    
    # parse arguments
    parser = argparse.ArgumentParser(description='Specify model to use')
    parser.add_argument('--model', type=str, default='knn', 
                        help='Specify the model (default: knn)')

    # get arguments
    args = parser.parse_args()
    
    # load model
    path = './models/' + args.model + '_model'
    if args.model == 'nn':
        model = load_model(path + '.h5')
    else:
        model = joblib.load(path + '.joblib')
        
    # run recognition
    main(model)