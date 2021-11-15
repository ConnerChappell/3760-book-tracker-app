const { model, Schema } = require('mongoose')

const Book = new Schema({
    id: String,
    author: Array,
    title: String,
    yearPublished: Number,
    wishList: {
        type: Boolean,
        default: false,
    },
    completed: {
        type: Boolean,
        default: false,
    }
})

module.exports = model('book', Book)