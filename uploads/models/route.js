const express = require('express');
const multer = require('multer');
const Book = require('../models/Book');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Create a new book listing
router.post('/', upload.array('images', 3), async (req, res) => {
    try {
        const { title, author, genre, condition, description, price, contactPhone } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const newBook = new Book({
            title, author, genre, condition, description, price, contactPhone, images
        });

        await newBook.save();
        res.status(201).json({ message: 'Book listed successfully!', book: newBook });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
