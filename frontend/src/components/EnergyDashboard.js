import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnergyDashboard = ({ energyData = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deviceBreakdown, setDeviceBreakdown] = useState([]);

    console.log("Received energyData:", energyData); // Debug log

    // Process data to aggregate by date (client-side)
    const processDataByDate = () => {
        const dateMap = new Map();
        
        // Use mock data if energyData is empty
        const dataToProcess = energyData.length > 0 ? energyData : [
            { date: '2025-03-01', device: 'TV', consumption: 2.5 },
            { date: '2025-03-01', device: 'Refrigerator', consumption: 3.2 },
            { date: '2025-03-02', device: 'Washing Machine', consumption: 1.8 },
            { date: '2025-03-03', device: 'TV', consumption: 2.7 },
            { date: '2025-03-03', device: 'Dishwasher', consumption: 2.0 }
        ];
        
        dataToProcess.forEach(entry => {
            const dateStr = entry.date;
            
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
        
        return Array.from(dateMap.values())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const aggregatedData = processDataByDate();
    console.log("Aggregated data:", aggregatedData); // Debug log

    // Prepare the chart data format
    const chartData = {
        labels: aggregatedData.map(data => new Date(data.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Energy Usage (kWh)',
                data: aggregatedData.map(data => data.totalConsumption),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const handleBarClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedData = aggregatedData[index];
            
            setSelectedDate(selectedData.date);
            setDeviceBreakdown(selectedData.devices);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setDeviceBreakdown([]);
        setSelectedDate(null);
    };

    return (
        <div>
            <h2>Energy Usage Dashboard</h2>
            
            {aggregatedData.length > 0 ? (
                <div className="chart-container">
                    <Bar 
                        data={chartData} 
                        options={{
                            onClick: handleBarClick,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        footer: () => 'Click for device breakdown'
                                    }
                                }
                            }
                        }} 
                    />
                    <p className="chart-help">Click on a bar to see device breakdown</p>
                </div>
            ) : (
                <p>No energy data available. Add some data to see your energy usage.</p>
            )}
            
            {/* Modal for device breakdown */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Device Energy Breakdown for {new Date(selectedDate).toLocaleDateString()}</h2>
                        {deviceBreakdown.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Device</th>
                                        <th>Consumption (kWh)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deviceBreakdown.map((device, index) => (
                                        <tr key={index}>
                                            <td>{device.device}</td>
                                            <td>{device.consumption}</td>
                                        </tr>
                                    ))}
                                    <tr className="total-row">
                                        <td><strong>Total</strong></td>
                                        <td><strong>
                                            {deviceBreakdown.reduce((sum, device) => sum + device.consumption, 0).toFixed(2)}
                                        </strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>No device data available for this date.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnergyDashboard;