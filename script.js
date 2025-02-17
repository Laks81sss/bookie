// Handle book resale form submission
document.getElementById('bookResellForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Get form data

    try {
        const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert('Book listed successfully!');
            this.reset();
            document.getElementById('imagePreview').innerHTML = '';
            fetchBooks(); // Refresh book list after adding a new book
        } else {
            alert(data.error || 'Something went wrong!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error listing the book');
    }
});

// Function to fetch and display books
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/api/books');
        const books = await response.json();

        const bookContainer = document.getElementById('bookContainer');
        bookContainer.innerHTML = ''; // Clear existing books

        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <h3>${book.title} - ${book.author}</h3>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Condition:</strong> ${book.condition}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                <p><strong>Contact:</strong> ${book.contactPhone}</p>
                ${book.images.map(img => `<img src="http://localhost:5000${img}" width="100">`).join('')}
            `;
            bookContainer.appendChild(bookElement);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Call fetchBooks when the page loads
document.addEventListener('DOMContentLoaded', fetchBooks);
