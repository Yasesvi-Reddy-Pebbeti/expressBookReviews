const axios = require("axios");
const BASE_URL = "http://localhost:5000";

// ✅ Task 10: Get all books using Callback
function getAllBooksCallback(callback) {
  axios
    .get(`${BASE_URL}/`)
    .then((response) => {
      callback(null, response.data);
    })
    .catch((error) => {
      callback(error, null);
    });
}

// ✅ Task 11: Get book details based on ISBN using Promises
function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`);
}

// ✅ Task 12: Get books by Author using Async/Await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(`\n👩‍💻 Books by Author "${author}":`);
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error fetching books by author:", error.message);
  }
}

// ✅ Task 13: Get books by Title using Async/Await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    console.log(`\n📔 Books with Title "${title}":`);
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error fetching books by title:", error.message);
  }
}

// Run all tasks sequentially
console.log("📚 Running Async Tasks...");

// Task 10: Callback
getAllBooksCallback((err, data) => {
  if (err) {
    console.error("❌ Error fetching all books:", err.message);
  } else {
    console.log("\n📚 All Books (via Callback):");
    console.log(data);

    // Task 11: Promises
    getBookByISBN(1)
      .then((response) => {
        console.log(`\n📖 Book with ISBN 1 (via Promise):`);
        console.log(response.data);
      })
      .then(() => getBooksByAuthor("Jane Austen")) // Task 12
      .then(() => getBooksByTitle("Pride and Prejudice")) // Task 13
      .catch((error) => console.error("❌ Error:", error.message));
  }
});

// Task 12: Get books by Author using Async/Await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(`\n👩‍💻 Books by Author "${author}":`);
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error fetching books by author:", error.response?.data || error.message);
  }
}

// Run it
getBooksByAuthor("Jane Austen");