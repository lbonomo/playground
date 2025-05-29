
import flask
from flask import Flask, jsonify, request, make_response
from random import randint
app = Flask(__name__)

@app.route("/")
def home():
    '''
    Render a simple HTML welcome page.
    '''
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body>
    <h1>Welcome to the Flask App!</h1>
    <p>This is a simple Flask application.</p>
    <p>Use the endpoints to interact with the app.</p>
    <ul>
        <li><a href="/random?min=1&max=100">Random Number</a></li>
        <li><a href="/health">Health Check</a></li>
        <li>
            <label for="data">Send a message:</label>
            <input type="text" id="data" name="data">
            <button type="submit" onclick="sendData()">Send</button>
            <script>
                function sendData() {
                    const data = document.getElementById('data').value;
                    fetch('/echo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: data })
                    })
                    .then(response => response.json())
                    .then(data => alert('Response: ' + JSON.stringify(data)))
                    .catch(error => console.error('Error:', error));
                }
            </script>
        </li>
    </ul>
</body>
</html>
"""

@app.route("/echo", methods=["POST"])
def echo():
    data = request.json
    return jsonify({"you_sent": data})


@app.route("/random", methods=["GET"])
def random_number():
    '''
    Generate a random number between min and max values provided in the request.
    If no values are provided, defaults are min=1 and max=100.
    Example request: /random?min=10&max=50
    '''

    # Get parameters from the request
    min_value = request.args.get("min", default=0, type=int)
    max_value = request.args.get("max", default=100, type=int)
    number = randint(min_value, max_value)
    return jsonify({"random_number": number})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)

@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({"error": "Internal server error"}), 500)

# Solo para desarrollo local
if __name__ == "__main__":
    app.run(debug=True)