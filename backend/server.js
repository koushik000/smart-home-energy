const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const energyRoutes = require('./routes/energy');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/energy', energyRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/energyDB')
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error(err));