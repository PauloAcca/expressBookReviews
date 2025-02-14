const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username 
  const password = req.query.password

  if (username && password) {
    const filteredUsers = users.filter(user=> user.username === username);
    if (filteredUsers.length > 0 ){
        return res.json("The user " + username + " already exists");
    } else {
        users.push({
            "username":username,
            "password":password
        });
        return res.json("The user " + username + " has been added!");
    }
  } else {
    return res.status(404).json({ message: "Username and password missed"});
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn

  if (books[isbn]){
    res.json(books[isbn])
  } else {
    res.status(404).json({ message: "Libro no encontrado"});
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length>0){
    return res.json(booksByAuthor);
  }

  return res.status(404).json({message: "Autor no encontrado"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length>0){
    return res.json(booksByTitle);
  }

  return res.status(404).json({message: "Titulo no encontrado"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  if (books[isbn]){
    res.json(books[isbn].reviews)
  } else {
    res.status(404).json({ message: "Libro no encontrado"});
  }
});

module.exports.general = public_users;
