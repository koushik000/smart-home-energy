import React, { useState } from 'react';
import axios from 'axios';

const EnergyForm = ({ onAddData }) => {
    const [date, setDate] = useState('');
    const [device, setDevice] = useState('');
    const [consumption, setConsumption] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEntry = { date, device, consumption: parseFloat(consumption) };

        try {
            // Send a POST request to the API to add new data
            const response = await axios.post('http://localhost:5000/api/energy', newEntry);
            // Call the callback to update the parent state with the new entry
            onAddData(response.data);
        } catch (error) {
            console.error("Error adding data: ", error);
        }

        // Clear the form fields
        setDate('');
        setDevice('');
        setConsumption('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <input
                type="text"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                placeholder="Device Name"
                required
            />
            <input
                type="number"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                placeholder="Consumption (kWh)"
                required
            />
            <button type="submit">Add Data</button>
        </form>
    );
};

export default EnergyForm;