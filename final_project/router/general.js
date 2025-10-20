const express = require("express");
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

// ✅ Task 1: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// ✅ Task 2: Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// ✅ Task 3: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ✅ Task 4: Get book details based on author (case-insensitive search)
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.trim().toLowerCase(); // normalize input

  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author.trim().toLowerCase() === author;
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// ✅ Task 5: Get book details based on title (case-insensitive search)
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.trim().toLowerCase(); // normalize input

  const booksByTitle = Object.values(books).filter(
    (book) => book.title.trim().toLowerCase() === title
  );

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


// ✅ Task 6: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res
      .status(404)
      .json({ message: "Book not found or has no reviews" });
  }
});

module.exports.general = public_users;
