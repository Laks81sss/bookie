const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    contactPhone: { type: String, required: true },
    images: [{ type: String }],
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
