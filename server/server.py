from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.get_json()
    print("Received data:", data)
    # Process the data as needed
    # ...

    return jsonify({'message': 'Data received successfully'})


if __name__ == '__main__':
    app.run(debug=False)
