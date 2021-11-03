const searchInput = document.querySelector('.book-search-input')
const searchBtn = document.querySelector('.book-search-btn')
const searchResultsDiv = document.querySelector('.search-results')
// let searchResults = []

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
    searchResultsDiv.innerHTML = ""
    let searchValue = searchInput.value

    fetch(`https://openlibrary.org/search.json?q=${searchValue}&limit=15`)
        .then((res) => res.json())
        .then((data) => {
            data.docs.forEach((book) => {
                addToList(
                    book.edition_key[0],
                    book.title,
                    book.author_name,
                    book.first_publish_year,
                )
            })
        })
}

// Adds cards to search results list 
function addToList(bookKey, bookTitle, bookAuthor, yearPublished) {
    let card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
        <div class="card-body" id=${bookKey}>
            <h5 class="card-title">${bookTitle}</h5>
            <h6 class="card-subtitle mb-2 text-muted">by ${bookAuthor}</h6>
            <p class="card-text">Published in ${yearPublished}</p>
            <button type="button" class="btn btn-secondary" id="add-to-wishlist-btn">Want to Read</button>
            <button type="button" class="btn btn-secondary" id="add-to-completed-books-btn">Completed</button>
        </div>
    `

    searchResultsDiv.appendChild(card)
}