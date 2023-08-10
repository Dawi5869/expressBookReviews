const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let validUsers = users.filter((user) => {
        return (user.username === username);
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter((user) => {
        return (user.username === username & user.password === password);
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    req.session.username = username;
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = req.session.username;
    let isbn = req.params.isbn;
    let review = books[isbn]["reviews"][username];
    let new_review = req.query.review;
    if(review) {
        books[isbn]["reviews"][username] = new_review;
        
    } else {
        books[isbn]["reviews"][username] = new_review;
        
    }
    res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let username = req.session.username;
    if(books[isbn]["reviews"][username]) {
        delete books[isbn]["reviews"][username];
        res.send(`${username}'s book review deleted. \n ` + JSON.stringify(books[isbn])); 
        
    } else {
        res.send("This user has not posted a review.")
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
