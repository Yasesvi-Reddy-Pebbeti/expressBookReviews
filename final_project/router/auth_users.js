const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

// ✅ In-memory array to store registered users
let users = [];

// ✅ Check if username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// ✅ Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// ✅ Task 7: User Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let accessToken = jwt.sign({ username: username }, "access", {
    expiresIn: "1h",
  });
  req.session.authorization = { accessToken, username };

  return res
    .status(200)
    .json({ message: "Login successful", token: accessToken });
});

// ✅ Task 8: Add or Modify a book review (only logged-in user)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// ✅ Task 9: Delete book review (only your own)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  if (book.reviews[username]) {
    delete book.reviews[username];
    return res
      .status(200)
      .json({ message: "Review deleted successfully", reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
