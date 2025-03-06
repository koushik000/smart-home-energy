const mongoose = require('mongoose');

const EnergyDataSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    device: { type: String, required: true },
    consumption: { type: Number, required: true }
});

module.exports = mongoose.model('EnergyData', EnergyDataSchema);