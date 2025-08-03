from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/api/init', methods=['GET'])
def init():
    # this should return the initial strategy of the AI, along with the currencies.
    return jsonify({})

@app.route('/api/register', methods=['POST'])
def reg():
    # register a new limit order, associated with the metamask ID. and store it in the db.
    data = request.get_json()
    return jsonify({'you_sent': data})

if __name__ == '__main__':
    app.run(debug=True)
