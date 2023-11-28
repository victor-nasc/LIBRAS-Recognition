from flask import Flask, jsonify, request, make_response
import base64

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
    with open("imageToSave.png", "wb") as fh:
        fh.write(image)

    # Export image to actual main.py

    return _corsify_actual_response(jsonify({"status": "success", "interpreted_data": 'a'}))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == '__main__':
    app.run(debug=True)
