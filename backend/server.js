require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use the variable from the .env file
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("--- PROD DATABASE CONNECTED ---"))
    .catch(err => console.error("DB ERROR:", err));

const Bug = mongoose.model('Bug', {
    title: String,
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
    gameArea: String,
    reproSteps: String,
    status: { type: String, default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

app.get('/api/bugs', async (req, res) => {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
});

app.post('/api/bugs', async (req, res) => {
    try {
        const newBug = new Bug(req.body);
        await newBug.save();
        res.status(201).json(newBug);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Production Server on ${PORT}`));