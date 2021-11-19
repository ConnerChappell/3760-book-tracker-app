const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { mongoURI, port } = require('./config')
const Book = require('./models/Book')
const app = express()

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected Successfully')
    app.listen(port, () => {
        console.log(`Server is running and happy on port ${port}`)
    })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(express.static('public'))

// Book format
//      id: book.edition_key[0],
//      title: book.title,
//      author: book.author_name,
//      yearPublished: book.first_publish_year,
//      wishList: false,
//      completed: false,

// GET all books
app.get("/allBooks", async (req, res) => {
    const books = await Book.find()
    console.log(books)
    res.json(books)
})

// GET wishlist
// app.get("/wishListBooks", async (req, res) => {
//     const wishListBooks = await Book.find({wishList: req.body.wishList === 'true'})
//     // console.log(wishListBooks)
//     res.json(wishListBooks)
// })

// GET completed list


// POST wishlist
app.post("/addToWishList", async (req, res) => {
    let wishListBooks = await Book.find({wishList: req.body.wishList === 'true'})

    const newBook = await new Book({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        yearPublished: req.body.yearPublished,
        wishList: req.body.wishList,
        completed: req.body.completed,
    })

    newBook.save()
        .then(async () => {
            wishListBooks = await Book.find({wishList: req.body.wishList === 'true'})
            // console.log(wishListBooks)
            res.json(wishListBooks)
        })
})

// POST completed list
