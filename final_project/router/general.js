const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Đăng ký người dùng mới (Task 6/7)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Lấy danh sách tất cả sách (Task 1 & Task 10 - Async/Await)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Lấy chi tiết sách qua ISBN (Task 2 & Task 11 - Promises)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({ message: err }));
});

// Lấy sách theo tác giả (Task 3 & Task 12 - Promises)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve) => {
    let result = [];
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        result.push({ isbn: key, ...books[key] });
      }
    });
    resolve(result);
  })
  .then((filteredBooks) => res.status(200).json(filteredBooks));
});

// Lấy sách theo tiêu đề (Task 4 & Task 13 - Promises)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let result = [];
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        result.push({ isbn: key, ...books[key] });
      }
    });
    resolve(result);
  })
  .then((filteredBooks) => res.status(200).json(filteredBooks));
});

// Lấy review của sách (Task 5)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;