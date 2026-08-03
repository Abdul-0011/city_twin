from flask import Flask, jsonify
from flask_cors import CORS
from coupled_model import CoupledCityModel

app = Flask(__name__)
CORS(app)

model = CoupledCityModel()
model.run(50)
df = model.get_dataframe()

@app.route('/summary')
def summary():
    zones = model.zones
    total_pop = sum(df[f'{z}_population'].iloc[-1] for z in zones)
    total_traffic = sum(df[f'{z}_traffic'].iloc[-1] for z in zones)
    return jsonify({
        "total_population": int(total_pop),
        "total_traffic": int(total_traffic),
        "zones": zones
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
