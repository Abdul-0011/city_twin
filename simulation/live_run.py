import time
from simulation.coupled_model import CoupledCityModel
from simulation.backend_client import BackendClient

client = BackendClient()
zone_ids = client.ensure_zones(['Downtown', 'Northside', 'Eastside', 'Southside', 'Westside'])

params = client.get_parameters()
model = CoupledCityModel(zoning_strictness=params['ZONING_STRICTNESS'], speed_limit=params['SPEED_LIMIT'])

while True:
    model.step()
    for i, zone in enumerate(model.zones):
        eid = zone_ids[zone]
        client.post_state(eid, "POPULATION", float(model.population_model.population[i]))
        client.post_state(eid, "CONGESTION", float(model.traffic_model.congestion[i]))
        client.post_state(eid, "ENERGY_KWH", float(model.energy_consumption[i]))
    time.sleep(5)
