const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Username and password are required." });
});

// Task 1 & Task 10: Get all books using async/await and Promise
public_users.get('/', async function (req, res) {
  try {
    const getBooks = async () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using async/await and Promise
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = async (id) => {
      return new Promise((resolve, reject) => {
        if (books[id]) {
          resolve(books[id]);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3 & Task 12: Get book details based on author using async/await and Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const getBooksByAuthor = async (auth) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if (books[isbn].author.toLowerCase() === auth) {
            matchingBooks.push({ isbn: isbn, ...books[isbn] });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found for this author"));
        }
      });
    };
    const matchingBooks = await getBooksByAuthor(author);
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4 & Task 13: Get all books based on title using async/await and Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const getBooksByTitle = async (ttl) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if (books[isbn].title.toLowerCase() === ttl) {
            matchingBooks.push({ isbn: isbn, ...books[isbn] });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found with this title"));
        }
      });
    };
    const matchingBooks = await getBooksByTitle(title);
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10-13 Implementation with Axios
const BASE_URL = "http://localhost:5000";

// Task 10: Fetch all books using Axios
async function fetchAllBooksWithAxios() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Axios fetchAllBooks error:", error.message);
    throw error;
  }
}

// Task 11: Fetch book by ISBN using Axios
async function fetchBookByISBNWithAxios(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error("Axios fetchBookByISBN error:", error.message);
    throw error;
  }
}

// Task 12: Fetch books by author using Axios
async function fetchBooksByAuthorWithAxios(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error("Axios fetchBooksByAuthor error:", error.message);
    throw error;
  }
}

// Task 13: Fetch books by title using Axios
async function fetchBooksByTitleWithAxios(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error("Axios fetchBooksByTitle error:", error.message);
    throw error;
  }
}

module.exports.general = public_users;
module.exports.fetchAllBooksWithAxios = fetchAllBooksWithAxios;
module.exports.fetchBookByISBNWithAxios = fetchBookByISBNWithAxios;
module.exports.fetchBooksByAuthorWithAxios = fetchBooksByAuthorWithAxios;
module.exports.fetchBooksByTitleWithAxios = fetchBooksByTitleWithAxios;