from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
from maintainer import maintainer

app = Flask(__name__)

scheduler = BackgroundScheduler()
scheduler.add_job(maintainer, 'interval', days=1)
scheduler.start()


@app.route('/api/init', methods=['GET'])
def init():
    # this should return the initial strategy of the AI, along with the currencies.
    return jsonify({})

@app.route('/api/new-order', methods=['POST'])
def new():
    # register a new limit order, associated with the metamask ID. and store it in the db.
    data = request.get_json()
    return jsonify({'you_sent': data})


if __name__ == '__main__':
    app.run(debug=True)
