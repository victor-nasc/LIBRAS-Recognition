from flask import Flask, jsonify, request, make_response
import base64
import os

import cv2
import numpy as np
import joblib
import argparse

from cvzone.HandTrackingModule import HandDetector
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)

# CORS allow all origins to access this server before any request


@app.before_request
def before_request():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    else:
        pass


@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.get_json()
    data = data['data']
    # print("Received data: ", data)

    base64_image_data = data.split(",")[1]

    # Convert base64 image to actual image
    image = base64.b64decode(base64_image_data)
    final_label = ''

    try:
        filename = "./images/sample.png"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "wb") as fh:
            fh.write(image)

        final_label = main()
    except Exception as e:
        print(f"Error ocurred: {e}")

    return _corsify_actual_response(jsonify({"status": "success", "interpreted_data": final_label}))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def main():
    # parse arguments
    parser = argparse.ArgumentParser(description='Specify model to use')
    parser.add_argument('--model', type=str, default='knn',
                        help='Specify the model (default: knn)')

    # get arguments
    args = parser.parse_args()

    # load model
    path = './server/models/' + args.model + '_model'
    model = joblib.load(path + '.joblib')

    # define labels
    labels = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'L', 'M',
              'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y']

    # define hand detector
    detector = HandDetector(maxHands=1, detectionCon=0.5)

    # initialize variables
    label = ''
    text = ''
    time = 0
    max_time = 10  # time to wait before adding a new letter to the text
    y = x = w = 0
    font = cv2.FONT_HERSHEY_SIMPLEX

    image_path = "./images/sample.png"

    frame = cv2.imread(image_path)

    # detect hands
    hands, _ = detector.findHands(frame.copy(), flipType=True)

    # if the hand was detected
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
        points = np.reshape(points, (1, -1))[0]
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
        if old_label == label:
            time += 1

    return label


if __name__ == "__main__":
    '''
    Available models: ( use --model=MODEL_NAME )
        - knn
        - rf     (random forest)
        - svm
        - logreg (logistic regression)
        - nn     (neural network)
    '''

    # Start flask server
    app.run(debug=True)

    # # run recognition
    # main()
