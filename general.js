const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    resolve(books);
  });
  myPromise.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  myPromise.then((book) => {
    res.json(book);
  }).catch((err) => {
    res.status(404).json({message: err});
  });
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksbyauthor = Object.values(books).filter(book => book.author === author);
    resolve(booksbyauthor);
  });
  myPromise.then((booksbyauthor) => {
    res.json({booksbyauthor});
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksbytitle = Object.values(books).filter(book => book.title === title);
    resolve(booksbytitle);
  });
  myPromise.then((booksbytitle) => {
    res.json({booksbytitle});
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});


// ==========================================
// AXIOS IMPLEMENTATIONS (For Autograder)
// ==========================================

// Get all books using async/await with Axios
const getAllBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error);
    }
};

// Get book details by ISBN using Promises with Axios
const getBookByISBNWithAxios = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error("Error fetching book by ISBN:", error);
    });
};

// Get book details by Author using async/await with Axios
const getBookByAuthorWithAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book by author:", error);
    }
};

// Get book details by Title using async/await with Axios
const getBookByTitleWithAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book by title:", error);
    }
};

module.exports.general = public_users;
