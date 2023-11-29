import os
import cv2
import pandas as pd
import argparse

from cvzone.HandTrackingModule import HandDetector



def main(size, save):

    # create directory
    DATA_DIR = './images'
    if not os.path.exists(DATA_DIR) and save:
        os.makedirs(DATA_DIR)

    # define labels
    labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'L', 'M', 'N',
              'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y']

    # initialize hand detector
    detector = HandDetector(maxHands=1, detectionCon=0.5)

    # initialize dataframe
    columns = ['label']
    columns.extend([f'{axis}{i}' for i in range(21) for axis in ['x', 'y', 'z']])
    df = pd.DataFrame(columns=columns)


    # initialize video capture
    cap = cv2.VideoCapture(0)
    font = cv2.FONT_HERSHEY_SIMPLEX

    # for each letter
    for c in labels:
        # create directory
        if not os.path.exists(os.path.join(DATA_DIR, str(c))) and save:
            os.makedirs(os.path.join(DATA_DIR, str(c)))
        
        # wait for user 
        while True:
            _, frame = cap.read()
            
            # show capture status
            cv2.putText(frame, 'Capturing {}'.format(c), (50,50), font, 1, (0, 255, 0), 2)
            cv2.putText(frame, 'Press \'S\' to start', (50,90), font, 1, (0, 255, 0), 2)
            cv2.putText(frame, 'Press \'Q\' to exit', (50,130), font, 1, (0, 255, 0), 2)
            cv2.imshow('frame', frame)
            
            # wait for user
            key = cv2.waitKey(1) & 0xFF
            if key == ord('s'):
                break
            elif key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                return
            
        # capture images
        i = 0
        while i < size:
            _, frame = cap.read()
            
            # show capture status
            cv2.putText(frame, 'Capturing {}'.format(c), (50,50), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, '{}'.format(size-i), (50,90), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            # detect and show frame 
            hands, img = detector.findHands(frame.copy(), flipType=True)
            cv2.imshow('frame', img)
                    
            # save landmarks and image
            points = [c]
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

                # add landmarks to 'csv' file
                row = dict(zip(df.columns, points))
                df.loc[len(df)] = row
                
                # save image 
                if save:
                    name = str(c)+'_'+str(i)+'.jpg'
                    cv2.imwrite(os.path.join(DATA_DIR, str(c), name), frame)
                i += 1

            # ask for switch hands
            if i == size//2:
                while True:
                    _, frame = cap.read()
                    cv2.putText(frame, 'Switch Hands! (keep the same sign)', (25,50), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.putText(frame, 'Press "N" to continue', (25,90), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.imshow('frame', frame)
                    if cv2.waitKey(1) & 0xFF == ord('n'):
                        break

            cv2.waitKey(25)
            
        print('Captured {} images for {}'.format(size, c))      
        
        
    # save dataframe to csv
    df.to_csv('data.csv', index=False)

    # release video capture
    cap.release()
    cv2.destroyAllWindows()
    
    
if __name__ == "__main__":
    '''
    Arguments:
        --save: save images (default: False)
        --size: number of images to capture (default: 256)
    '''
    
    # parse arguments
    parser = argparse.ArgumentParser(description='Save images?')
    parser.add_argument('--save', type=bool, default=False, help='Save images?')
    parser.add_argument('--size', type=int, default=256, help='Total data of each class')

    # get arguments
    args = parser.parse_args()

    # collect data
    main(args.size, args.save)
