import requests
from datetime import datetime, timezone

BASE_URL = "http://localhost:8080/api"

class BackendClient:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url

    def ensure_zones(self, zone_names):
        """Return {zone_name: entity_id}, creating any zones that don't exist yet."""
        existing = requests.get(f"{self.base_url}/entities", params={"type": "ZONE"}).json()
        by_name = {e["name"]: e["id"] for e in existing}
        for name in zone_names:
            if name not in by_name:
                resp = requests.post(f"{self.base_url}/entities", json={
                    "type": "ZONE", "name": name, "latitude": 0.0, "longitude": 0.0
                })
                by_name[name] = resp.json()["id"]
        return by_name

    def get_parameters(self) -> dict:
        params = requests.get(f"{self.base_url}/parameters").json()
        return {p["type"]: p["value"] for p in params}

    def post_state(self, entity_id, metric_type, value):
        requests.post(f"{self.base_url}/states", json={
            "entity": {"id": entity_id},
            "metricType": metric_type,
            "value": value,
            # EntityState.timestamp is @NotNull on the backend — every post_state()
            # call was getting rejected with a 400 before this was added.
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        })
