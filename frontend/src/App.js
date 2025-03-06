import React, { useState, useEffect } from 'react';
import EnergyDashboard from './components/EnergyDashboard';
import EnergyForm from './components/EnergyForm';
import axios from 'axios';
import './App.css';

const App = () => {
    const [energyData, setEnergyData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:5000/api/energy');
                setEnergyData(result.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Process the data to aggregate by date
    const processDataByDate = () => {
        // Create a map to aggregate data by date
        const dateMap = new Map();
        
        energyData.forEach(entry => {
            const dateStr = new Date(entry.date).toISOString().split('T')[0];
            
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, {
                    date: dateStr,
                    totalConsumption: 0,
                    devices: []
                });
            }
            
            const dateData = dateMap.get(dateStr);
            dateData.totalConsumption += entry.consumption;
            dateData.devices.push({
                device: entry.device,
                consumption: entry.consumption
            });
        });
        
        // Convert map to array and sort by date
        return Array.from(dateMap.values())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const addEnergyData = (newData) => {
        setEnergyData((prevData) => [...prevData, newData]);
    };

    // Get the aggregated data
    const aggregatedData = processDataByDate();

    return (
        <div>
            <h1>Smart Home Energy Monitoring</h1>
            <EnergyForm onAddData={addEnergyData} />
            {loading ? (
                <p>Loading energy data...</p>
            ) : (
                <EnergyDashboard 
                    energyData={energyData} 
                    aggregatedData={aggregatedData} 
                />
            )}
        </div>
    );
};

export default App;