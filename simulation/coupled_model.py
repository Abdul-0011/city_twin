"""
Coupled City Digital Twin Model
Simulation Engineer: HUSSEY Joseph
"""

import numpy as np
import pandas as pd
from population_model import PopulationModel
from traffic_model import TrafficModel

class CoupledCityModel:
    """
    Complete coupled model with all city systems interacting
    """
    
    def __init__(self):
        self.zones = ['Downtown', 'Northside', 'Eastside', 'Southside', 'Westside']
        
        # Initialize population model
        self.population_model = PopulationModel()
        
        # Initialize traffic model
        self.traffic_model = TrafficModel(self.zones)
        
        # Add energy consumption
        self.energy_efficiency = 0.85
        self.energy_consumption = np.zeros(len(self.zones))
        
        # History tracking
        self.history = []
        self.time = 0
    
    def step(self):
        """Advance all systems by one time step"""
        
        # 1. Update population
        self.population_model.step()
        population = self.population_model.population
        
        # 2. Update traffic based on population
        self.traffic_model.update(population)
        traffic = self.traffic_model.traffic_volume
        
        # 3. Calculate energy consumption
        traffic_energy = traffic * 0.5
        population_energy = population * 0.1
        self.energy_consumption = (traffic_energy + population_energy) / self.energy_efficiency
        
        # 4. Update attractiveness based on congestion
        congestion = self.traffic_model.congestion
        traffic_factor = 1 - np.clip(congestion / 2, 0, 0.5)
        density_factor = 1 - (population / np.max(population)) * 0.2
        self.population_model.attractiveness = 0.3 + 0.7 * (traffic_factor * density_factor)
        
        # 5. Record history
        self.history.append({
            'time': self.time,
            'population': population.copy(),
            'traffic': traffic.copy(),
            'congestion': congestion.copy(),
            'energy': self.energy_consumption.copy(),
            'attractiveness': self.population_model.attractiveness.copy()
        })
        
        self.time += 1
        return self
    
    def run(self, years=50):
        """Run simulation for specified years"""
        for _ in range(years):
            self.step()
        return self
    
    def get_dataframe(self):
        """Get all data as DataFrame"""
        data = []
        for h in self.history:
            row = {'time': h['time']}
            for i, zone in enumerate(self.zones):
                row[f'{zone}_population'] = h['population'][i]
                row[f'{zone}_traffic'] = h['traffic'][i]
                row[f'{zone}_energy'] = h['energy'][i]
                row[f'{zone}_congestion'] = h['congestion'][i]
                row[f'{zone}_attractiveness'] = h['attractiveness'][i]
            data.append(row)
        return pd.DataFrame(data)
    
    def reset(self):
        """Reset all models"""
        self.population_model.reset()
        self.traffic_model = TrafficModel(self.zones)
        self.energy_consumption = np.zeros(len(self.zones))
        self.history = []
        self.time = 0
        return self

# Main test
if __name__ == "__main__":
    print("🏙️ Coupled City Digital Twin")
    print("=" * 50)
    
    model = CoupledCityModel()
    model.run(50)
    df = model.get_dataframe()
    
    print(f"✅ Simulation complete!")
    print(f"   Years: {len(df)}")
    
    print("\n📊 Final system states:")
    for i, zone in enumerate(model.zones):
        print(f"\n   {zone}:")
        print(f"      Population: {int(df[f'{zone}_population'].iloc[-1]):,}")
        print(f"      Traffic: {int(df[f'{zone}_traffic'].iloc[-1]):,}")
        print(f"      Energy: {int(df[f'{zone}_energy'].iloc[-1]):,}")
        print(f"      Congestion: {df[f'{zone}_congestion'].iloc[-1]:.2f}")
    
    total_pop = sum(df[f'{zone}_population'].iloc[-1] for zone in model.zones)
    total_traffic = sum(df[f'{zone}_traffic'].iloc[-1] for zone in model.zones)
    print(f"\n📈 Totals:")
    print(f"   Total Population: {int(total_pop):,}")
    print(f"   Total Traffic: {int(total_traffic):,}")
