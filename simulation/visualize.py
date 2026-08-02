"""
Visualization for City Digital Twin Simulation
Simulation Engineer: HUSSEY Joseph
"""

import matplotlib.pyplot as plt
import pandas as pd
from coupled_model import CoupledCityModel

# Run simulation
print("🏙️ Running simulation for visualization...")
model = CoupledCityModel()
model.run(50)
df = model.get_dataframe()

# Create visualizations
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Population over time
for zone in model.zones:
    axes[0, 0].plot(df['time'], df[f'{zone}_population'], label=zone, linewidth=2)
axes[0, 0].set_xlabel('Year')
axes[0, 0].set_ylabel('Population')
axes[0, 0].set_title('Population Growth by Zone')
axes[0, 0].legend()
axes[0, 0].grid(True)

# 2. Traffic over time
for zone in model.zones:
    axes[0, 1].plot(df['time'], df[f'{zone}_traffic'], label=zone, linewidth=2)
axes[0, 1].set_xlabel('Year')
axes[0, 1].set_ylabel('Traffic Volume')
axes[0, 1].set_title('Traffic Volume by Zone')
axes[0, 1].legend()
axes[0, 1].grid(True)

# 3. Energy consumption
for zone in model.zones:
    axes[1, 0].plot(df['time'], df[f'{zone}_energy'], label=zone, linewidth=2)
axes[1, 0].set_xlabel('Year')
axes[1, 0].set_ylabel('Energy Consumption')
axes[1, 0].set_title('Energy Consumption by Zone')
axes[1, 0].legend()
axes[1, 0].grid(True)

# 4. Congestion levels
for zone in model.zones:
    axes[1, 1].plot(df['time'], df[f'{zone}_congestion'] * 100, label=zone, linewidth=2)
axes[1, 1].set_xlabel('Year')
axes[1, 1].set_ylabel('Congestion (%)')
axes[1, 1].set_title('Traffic Congestion by Zone')
axes[1, 1].legend()
axes[1, 1].grid(True)

plt.tight_layout()
plt.savefig('city_digital_twin_visualization.png', dpi=300)
plt.show()

print("\n✅ Visualization saved as 'city_digital_twin_visualization.png'")

# Summary statistics
print("\n📊 Summary Statistics:")
print(f"   Total Population (Final): {int(df['Downtown_population'].iloc[-1] + df['Northside_population'].iloc[-1] + df['Eastside_population'].iloc[-1] + df['Southside_population'].iloc[-1] + df['Westside_population'].iloc[-1]):,}")
print(f"   Total Traffic (Final): {int(df['Downtown_traffic'].iloc[-1] + df['Northside_traffic'].iloc[-1] + df['Eastside_traffic'].iloc[-1] + df['Southside_traffic'].iloc[-1] + df['Westside_traffic'].iloc[-1]):,}")
print(f"   Average Congestion: {df['Downtown_congestion'].mean() * 100:.1f}%")
