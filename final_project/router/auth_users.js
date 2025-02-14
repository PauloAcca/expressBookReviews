const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password==password)
}

const SECRET_KEY = "your_secret_key";
//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password missed" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar un token JWT
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({ message: "Login exitoso", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.query.review; 
  const username = req.user.username;
  if (!books[isbn]) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (!review) {
        return res.status(400).json({ message: "Debe enviar una reseña" });
    }
    
  if(books[isbn]){
    books[isbn].reviews[username] = review
  }
   return res.status(200).json({ message: "Reseña añadida exitosamente", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  
  if (!books[isbn]) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (books[isbn]) {
        const reviewName = books[isbn].reviews[username]
        if (!reviewName) {
            return res.status(404).json({ message: "review no encontrada" });
        }
        delete reviewName
        return res.status(200).json({ message: "Reseña eliminada exitosamente" });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
