import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EnergyDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { devices } = location.state || { devices: [] };

    return (
        <div>
            <h1>Energy Consumption Details</h1>
            <button onClick={() => navigate(-1)}>Back</button>
            <ul>
                {devices.map((device, index) => (
                    <li key={index}>
                        {device.name}: {device.consumption} kWh
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EnergyDetails;
