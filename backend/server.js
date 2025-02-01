const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./config/db");
require('dotenv').config(); // Load environment variables

// Initialize Express App
const app = express();
connectDB();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes **AFTER initializing `app`**
const audioRoutes = require('./routes/audioRoutes');
const pythonRoutes = require('./routes/pythonRoutes'); 
//const meetingMinutesRoutes = require('./routes/meetingMinutesRoutes'); 

// Use Routes
app.use('/api/audio', audioRoutes);
app.use('/api/python', pythonRoutes);
//app.use('/api/meeting', meetingMinutesRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
