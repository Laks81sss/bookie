require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware (Ensure middleware is above routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bookverse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ Connection error:"));
db.once("open", () => {
    console.log("✅ MongoDB Connected!");
});

// ✅ Define Schema & Model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    condition: String,
    description: String,
    price: Number,
    contactPhone: String,
    images: [String]
});

const Book = mongoose.model('Book', bookSchema);

// ✅ Image Upload Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ Routes

// 🟢 Test Route
app.get("/test", (req, res) => {
    res.send("Server is working!");
});

// 🟢 Add a book listing
app.post('/api/resell', upload.array('images', 3), async (req, res) => {
    try {
        const { title, author, genre, condition, description, price, contactPhone } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const newBook = new Book({ title, author, genre, condition, description, price, contactPhone, images });
        await newBook.save();

        res.status(201).json({ message: 'Book listed successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ error: 'Error listing book' });
    }
});

// 🟢 Get all book listings
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
});

// 🟢 Add a book (alternative method)
app.post("/books", async (req, res) => {
    console.log(req.body);
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Error adding book", error });
    }
});

// ✅ Start Server (Ensure this is at the bottom)
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
