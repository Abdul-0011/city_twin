"""
Interactive Dashboard for City Digital Twin
Simulation Engineer: HUSSEY Joseph
Run with: streamlit run dashboard.py
"""

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from coupled_model import CoupledCityModel

st.set_page_config(page_title="City Digital Twin", layout="wide")

st.title("🏙️ City Digital Twin Simulation")
st.markdown("### Interactive Urban Simulation Dashboard")

# Sidebar controls
st.sidebar.header("⚙️ Simulation Controls")
years = st.sidebar.slider("Simulation Years", 10, 100, 50, 10)
run_button = st.sidebar.button("▶️ Run Simulation")

# Initialize session state
if 'model' not in st.session_state:
    st.session_state.model = None
    st.session_state.df = None

if run_button:
    with st.spinner("🏗️ Building your city simulation..."):
        st.session_state.model = CoupledCityModel()
        st.session_state.model.run(years)
        st.session_state.df = st.session_state.model.get_dataframe()
    st.success("✅ Simulation complete!")

if st.session_state.df is not None:
    df = st.session_state.df
    model = st.session_state.model
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    total_pop = int(df[[f'{zone}_population' for zone in model.zones]].iloc[-1].sum())
    total_traffic = int(df[[f'{zone}_traffic' for zone in model.zones]].iloc[-1].sum())
    avg_congestion = df[[f'{zone}_congestion' for zone in model.zones]].iloc[-1].mean() * 100
    
    col1.metric("👥 Total Population", f"{total_pop:,}")
    col2.metric("🚗 Total Traffic", f"{total_traffic:,}")
    col3.metric("📊 Avg Congestion", f"{avg_congestion:.1f}%")
    col4.metric("📅 Years Simulated", len(df))
    
    # Population chart
    st.subheader("📈 Population Trends")
    fig, ax = plt.subplots(figsize=(10, 5))
    for zone in model.zones:
        ax.plot(df['time'], df[f'{zone}_population'], label=zone, linewidth=2)
    ax.legend()
    ax.grid(True)
    ax.set_xlabel('Year')
    ax.set_ylabel('Population')
    st.pyplot(fig)
    
    # Traffic and Energy side by side
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🚗 Traffic Volume")
        fig, ax = plt.subplots(figsize=(8, 4))
        for zone in model.zones:
            ax.plot(df['time'], df[f'{zone}_traffic'], label=zone, linewidth=2)
        ax.legend()
        ax.grid(True)
        st.pyplot(fig)
    
    with col2:
        st.subheader("⚡ Energy Consumption")
        fig, ax = plt.subplots(figsize=(8, 4))
        for zone in model.zones:
            ax.plot(df['time'], df[f'{zone}_energy'], label=zone, linewidth=2)
        ax.legend()
        ax.grid(True)
        st.pyplot(fig)
    
    # Congestion chart
    st.subheader("🔴 Traffic Congestion")
    fig, ax = plt.subplots(figsize=(10, 5))
    for zone in model.zones:
        ax.plot(df['time'], df[f'{zone}_congestion'] * 100, label=zone, linewidth=2)
    ax.legend()
    ax.grid(True)
    ax.set_xlabel('Year')
    ax.set_ylabel('Congestion (%)')
    st.pyplot(fig)
    
    # Raw data table
    if st.checkbox("📊 Show Raw Data"):
        st.dataframe(df)
    
    # Export option
    if st.button("📥 Download CSV"):
        csv = df.to_csv(index=False)
        st.download_button(
            label="Download CSV",
            data=csv,
            file_name="city_simulation_data.csv",
            mime="text/csv"
        )

else:
    st.info("👈 Click 'Run Simulation' to start the city digital twin")
