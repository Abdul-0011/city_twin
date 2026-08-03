"""
City Traffic Simulation Model
Simulation Engineer: HUSSEY Joseph
"""

import numpy as np
import pandas as pd

class TrafficModel:
    """Traffic model for the city digital twin"""
    
    def __init__(self, zones):
        self.zones = zones
        self.road_capacity = 1000  # Vehicles per hour per lane
        self.traffic_volume = np.zeros(len(zones))
        self.congestion = np.zeros(len(zones))
        self.history = []
        self.time = 0
    
    def update(self, population_data):
        """Update traffic based on population"""
        # More people = more traffic
        base_traffic = population_data / 15  # 1 car per 15 people
        random_variation = 1 + np.random.normal(0, 0.1, size=len(population_data))
        
        self.traffic_volume = base_traffic * random_variation
        
        # Calculate congestion (0 = empty, 1 = full, >1 = jam)
        self.congestion = self.traffic_volume / self.road_capacity
        self.congestion = np.clip(self.congestion, 0, 2)
        
        # Record history
        self.history.append({
            'time': self.time,
            'traffic': self.traffic_volume.copy(),
            'congestion': self.congestion.copy()
        })
        
        self.time += 1
        return self.congestion
    
    def get_dataframe(self):
        """Return traffic history as DataFrame"""
        data = []
        for record in self.history:
            row = {'time': record['time']}
            for i, zone in enumerate(self.zones):
                row[f'{zone}_traffic'] = record['traffic'][i]
                row[f'{zone}_congestion'] = record['congestion'][i]
            data.append(row)
        return pd.DataFrame(data)

# Quick test
if __name__ == "__main__":
    from population_model import PopulationModel
    
    pop_model = PopulationModel()
    traffic_model = TrafficModel(pop_model.zones)
    
    print("🚗 City Traffic Simulation")
    print("-" * 40)
    
    for year in range(30):
        pop_model.step()
        traffic_model.update(pop_model.population)
    
    df = traffic_model.get_dataframe()
    print(f"✅ Traffic simulation complete!")
    print(f"   Years simulated: {len(df)}")
    print(f"\n📊 Final congestion levels:")
    for i, zone in enumerate(pop_model.zones):
        congestion_pct = df[f'{zone}_congestion'].iloc[-1] * 100
        status = "🔴 JAM" if congestion_pct > 90 else "🟡 BUSY" if congestion_pct > 60 else "🟢 FREE"
        print(f"   {zone}: {congestion_pct:.1f}% {status}")
