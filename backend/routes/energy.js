const express = require('express');
const router = express.Router();
const EnergyData = require('../models/EnergyData');

// POST endpoint to add energy data
router.post('/', async (req, res) => {
    const { date, device, consumption } = req.body;
    const energyEntry = new EnergyData({ date, device, consumption });

    try {
        await energyEntry.save();
        res.status(201).json(energyEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET endpoint to retrieve all energy data (without aggregation)
router.get('/', async (req, res) => {
    try {
        const data = await EnergyData.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// NEW: GET endpoint to retrieve aggregated data by date
router.get('/aggregated', async (req, res) => {
    try {
        const aggregatedData = await EnergyData.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalConsumption: { $sum: "$consumption" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json(aggregatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;