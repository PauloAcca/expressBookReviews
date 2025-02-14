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
public_users.get('/', function (req, res) {
    // Crear una promesa para simular un retraso en la respuesta
    let myPromise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);  // Resolvemos con los libros después de 6 segundos
        }, 6000);
    });

    // Usamos .then() para manejar la respuesta de la promesa
    myPromise1.then((booksData) => {
        console.log("Books data received successfully");
        res.send(booksData);  // Enviamos la respuesta solo cuando se resuelve la promesa
    }).catch((error) => {
        console.log("Error: " + error);
        res.status(500).send({ message: "Error al obtener los libros" });  // En caso de error, enviamos un mensaje adecuado
    });
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Creamos una promesa para la búsqueda del libro
    let findBookPromise = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);  // Resolvemos con el libro si existe
        } else {
            reject({ message: "Libro no encontrado" });  // Rechazamos si no se encuentra el libro
        }
    });

    // Usamos then para manejar la respuesta exitosa
    findBookPromise
        .then((book) => {
            res.json(book);  // Enviamos el libro encontrado
        })
        .catch((error) => {
            res.status(404).json(error);  // Enviamos el error si no se encuentra el libro
        });
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let findBookPromise = new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length>0){
    resolve( booksByAuthor);
  } else {
    reject({ message: "Libro no encontrado" });  // Rechazamos si no se encuentra el libro
}
});

// Usamos then para manejar la respuesta exitosa
findBookPromise
    .then((booksByAuthor) => {
        res.json(booksByAuthor);  // Enviamos el libro encontrado
    })
    .catch((error) => {
        res.status(404).json(error);  // Enviamos el error si no se encuentra el libro
    });

  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let findBookPromise = new Promise((resolve, reject) => {
    const booksBytitle = Object.values(books).filter(book => book.title === title);

  if (booksBytitle.length>0){
    resolve( booksBytitle);
  } else {
    reject({ message: "Libro no encontrado" });  // Rechazamos si no se encuentra el libro
}
});

// Usamos then para manejar la respuesta exitosa
findBookPromise
    .then((booksByAuthor) => {
        res.json(booksBytitle);  // Enviamos el libro encontrado
    })
    .catch((error) => {
        res.status(404).json(error);  // Enviamos el error si no se encuentra el libro
    });
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
