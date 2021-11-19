const searchInput = document.querySelector('.book-search-input')
const searchBtn = document.querySelector('.book-search-btn')
const searchResultsDiv = document.querySelector('.search-results')
const searchingForBooks = document.querySelector('.searching-for-books-header')
const wishlistBooksDiv = document.querySelector('.wishlist-books-list')
const completedBooksDiv = document.querySelector('.completed-books-list')

let searchResults = []
// let wantToRead = []
// let completedBooks = []

// Search input and search button event listeners
searchInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        getSearchResults()
        searchInput.value = ""
    }
})
searchBtn.addEventListener("click", (event) => {
    event.preventDefault()
    getSearchResults()
    searchInput.value = ""
})

// Event listeners buttons that add to wishlist and add to completed books
document.addEventListener('click', (event) => {
    if (event.target.id === "add-to-wishlist-btn") {
        // Add to wishlist function
        addToWishlist(event)
    } else if (event.target.id === "add-to-completed-books-btn") {
        // Add to completed function
        addToCompletedBooks(event)
    }
})

// function that fetches search results from the open library api
function getSearchResults() {
    searchingForBooks.innerHTML = "Searching..."
    let searchValue = searchInput.value

    fetch(`https://openlibrary.org/search.json?q=${searchValue}&limit=15`)
        .then((res) => res.json())
        .then((data) => {
            searchResults = data.docs.map((book) => {
                return {
                    id: book.edition_key[0],
                    title: book.title,
                    author: book.author_name,
                    yearPublished: book.first_publish_year,
                    wishList: false,
                    completed: false,
                }
            })
            displaySearchResults()
        })
}

// Adds cards of books to search results div
function displaySearchResults() {
    searchingForBooks.innerHTML = ""

    searchResults.forEach((book) => {
        let card = document.createElement("div")
        card.classList.add("card")

        card.innerHTML = `
            <div class="card-body" id=${book.id}>
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">by ${book.author}</h6>
                <p class="card-text">Published in ${book.yearPublished}</p>
                <button type="button" class="btn btn-secondary" id="add-to-wishlist-btn">Want to Read</button>
                <button type="button" class="btn btn-secondary" id="add-to-completed-books-btn">Completed</button>
            </div>
        `
        searchResultsDiv.appendChild(card)
    });
}
// Fetches all books
fetch("/allBooks")
.then(res => res.json())
.then(data => {
    console.log("all books:", data)
    data.forEach((book) => displaySearchResults(book))
})

// change wishList to true or false
function addToWishlist (event) {
    let bookID = event.target.parentElement.id
    let book = searchResults.find((book) => book.id === bookID)
    if (!book.wishList) {
        book.wishList = true
    } else {
        book.wishList = false
    }

    displayWishList()

    // POST adds book to wishList
    fetch("/addToWishList", {
        method: "POST",
        body: JSON.stringify({
            id: `${book.id}`,
            title: `${book.title}`,
            author: `${book.author}`,
            yearPublished: `${book.yearPublished}`,
            wishList: `${book.wishList}`,
            completed: `${book.completed}`,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
    .then((res) => res.json())
}

// displays cards of wishList books
function displayWishList () {
    // wishlistBooksDiv.innerHTML = ""
    searchResults.filter((book) => {
        if (book.wishList) {
            let card = document.createElement("div")
            card.classList.add("card")
    
            card.innerHTML = `
                <div class="card-body" id=${book.id}>
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">by ${book.author}</h6>
                    <p class="card-text">Published in ${book.yearPublished}</p>
                    <button type="button" class="btn btn-secondary" id="add-to-completed-books-btn">Completed</button>
                </div>
            `
            wishlistBooksDiv.appendChild(card)
        }
    })
}
// Fetches and displays wishlist
fetch("/wishListBooks/true", {
    method: "GET",
    headers: {
        "Content-type": "applicaation/json; charset=UTF-8"
    }
})
    .then((res) => res.json())
    .then((data) => {
        console.log("wishList books:", data)
        data.forEach((book) => {
            // displayWishList()
            let card = document.createElement("div")
            card.classList.add("card")
    
            card.innerHTML = `
                <div class="card-body" id=${book.id}>
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">by ${book.author}</h6>
                    <p class="card-text">Published in ${book.yearPublished}</p>
                    <button type="button" class="btn btn-secondary" id="add-to-completed-books-btn">Completed</button>
                </div>
            `
            wishlistBooksDiv.appendChild(card)
        })
    })

// change completed to true or false
function addToCompletedBooks (event) {
    let bookID = event.target.parentElement.id
    let book = searchResults.find((book) => book.id === bookID)
    if (!book.completed) {
        book.completed = true
    } else {
        book.completed = false
    }

    displayCompletedBooks()

    // POST adds books to completed
    fetch("/addToCompleted", {
        method: "POST",
        body: JSON.stringify({
            id: `${book.id}`,
            title: `${book.title}`,
            author: `${book.author}`,
            yearPublished: `${book.yearPublished}`,
            wishList: `${book.wishList}`,
            completed: `${book.completed}`,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
    .then((res) => res.json())
}

// displays cards of completed books
function displayCompletedBooks () {
    // completedBooksDiv.innerHTML = ""
    searchResults.filter((book) => {
        if (book.completed) {
            let card = document.createElement("div")
            card.classList.add("card")
    
            card.innerHTML = `
                <div class="card-body" id=${book.id}>
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">by ${book.author}</h6>
                    <p class="card-text">Published in ${book.yearPublished}</p>
                </div>
            `
            completedBooksDiv.appendChild(card)
        } if (book.wishList) {
            book.wishList = false
            displayWishList()
        }
    })
}
// Fetches and displays completed
fetch("/completedBooks/true", {
    method: "GET",
    headers: {
        "Content-type": "applicaation/json; charset=UTF-8"
    }
})
    .then((res) => res.json())
    .then((data) => {
        console.log("completed books:", data)
        data.forEach((book) => {
            // displayCompletedBooks()
            let card = document.createElement("div")
            card.classList.add("card")
    
            card.innerHTML = `
                <div class="card-body" id=${book.id}>
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">by ${book.author}</h6>
                    <p class="card-text">Published in ${book.yearPublished}</p>
                </div>
            `
            completedBooksDiv.appendChild(card)
        })
    })