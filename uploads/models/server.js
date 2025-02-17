const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.send('BookVerse API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
