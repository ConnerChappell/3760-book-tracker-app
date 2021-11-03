const searchInput = document.querySelector('.book-search-input')
const searchBtn = document.querySelector('.book-search-btn')
const searchResultsDiv = document.querySelector('.search-results')
const searchingForBooks = document.querySelector('.searching-for-books-header')

// let searchResults = []
// let wantToRead = []
// let completedBooks = []

// Search input and button event listeners
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

// function that fetches search results from the open library api
function getSearchResults() {
    searchingForBooks.innerHTML = "Searching..."
    let searchValue = searchInput.value

    fetch(`https://openlibrary.org/search.json?q=${searchValue}&limit=15`)
        .then((res) => res.json())
        .then((data) => {
            books = data.docs.map((book) => {
                return {
                    id: book.edition_key[0],
                    key: book.key,
                    title: book.title,
                    author: book.author_name,
                    yearPublished: book.first_publish_year,
                    wishList: false,
                    completed: false,
                    rating: 0,
                }
            })
            displaySearchResults()
        })
}

// Adds cards to search results list 
function displaySearchResults() {
    searchingForBooks.innerHTML = ""

    books.forEach((book) => {
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