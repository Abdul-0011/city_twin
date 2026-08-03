"""
City Population Simulation Model
Simulation Engineer: HUSSEY Joseph
Group: 41
Project: Urban-Simulator / City Digital Twin
"""

import numpy as np
import pandas as pd

class PopulationModel:
    """
    Population model for the City Digital Twin simulation.
    Models population growth and migration across city zones.
    """
    
    def __init__(self):
        # Define city zones
        self.zones = ['Downtown', 'Northside', 'Eastside', 'Southside', 'Westside']
        
        # Initial populations
        self.initial_population = np.array([50000, 75000, 120000, 45000, 30000])
        self.population = self.initial_population.copy()
        
        # Growth rates per zone
        self.growth_rates = np.array([0.03, 0.06, 0.04, 0.05, 0.07])
        
        # Attractiveness (affects migration)
        self.attractiveness = np.array([0.9, 0.7, 0.8, 0.6, 0.5])
        
        # History tracking
        self.history = []
        self.time = 0
    
    def step(self):
        """Advance population model by one time step (1 year)"""
        
        # Natural growth with random variation
        noise = 1 + np.random.normal(0, 0.02, size=len(self.population))
        growth = self.population * self.growth_rates * noise
        
        # Migration based on attractiveness
        avg_attractiveness = np.mean(self.attractiveness)
        migration = (self.attractiveness - avg_attractiveness) * 0.01 * self.population
        
        # Update population
        self.population = self.population + growth + migration
        
        # Ensure no negative values
        self.population = np.maximum(self.population, 0)
        
        # Record history
        self.history.append({
            'time': self.time,
            'populations': self.population.copy()
        })
        
        self.time += 1
        
        return self.population
    
    def run(self, years=50):
        """Run simulation for specified number of years"""
        for _ in range(years):
            self.step()
        return self
    
    def get_dataframe(self):
        """Return simulation history as pandas DataFrame"""
        data = []
        for record in self.history:
            row = {'time': record['time']}
            for i, zone in enumerate(self.zones):
                row[zone] = record['populations'][i]
            data.append(row)
        return pd.DataFrame(data)
    
    def reset(self):
        """Reset simulation to initial state"""
        self.population = self.initial_population.copy()
        self.history = []
        self.time = 0
        return self


# Quick test
if __name__ == "__main__":
    print("🏙️ City Population Simulation")
    print("-" * 40)
    
    model = PopulationModel()
    model.run(30)
    df = model.get_dataframe()
    
    print(f"✅ Simulation complete!")
    print(f"   Years simulated: {len(df)}")
    print(f"   Zones: {', '.join(model.zones)}")
    print(f"\n📊 Final populations:")
    for i, zone in enumerate(model.zones):
        print(f"   {zone}: {int(model.population[i]):,}")
    print(f"\n📈 Total growth: {model.population.sum() / model.initial_population.sum() - 1:.1%}")
