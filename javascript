const inputFromTitle = document.getElementById("movie-title");
const inputFromYear = document.getElementById("movie-year");
const inputFromDirector = document.getElementById("movie-director");
const submitButton = document.getElementById("submit");
const cancelEditButton = document.getElementById("cancel-edit");
const inputFromSearch = document.getElementById("movie-search");
let editingMovieId = null;
let movies = [];
let searchValue = '';
let warn = document.createElement("p");
warn.classList.add("errors");
warn.textContent = "⚠ Please fill in all fields";
let validYear = document.createElement("p");
validYear.textContent = "⚠ Year must be between 1888 and current year";
validYear.classList.add("valid");
validYear.classList.add("errors")
const errors = document.getElementById("error");
const takeSubmit = document.getElementById("movie-form");
inputFromSearch.addEventListener("input",function() {
    searchValue = inputFromSearch.value;
    renderMovies();
})
takeSubmit.addEventListener("submit",function(event) {
    event.preventDefault()
    let movie = {
    id: Date.now(),
    title: inputFromTitle.value,
    year: inputFromYear.value,
    director: inputFromDirector.value
}   
    if (movie.title && movie.director && movie.year) {
        if (validator() == true) {
            hideYearError()
        } else {
            showYearError()
            hideError()
            return
        }
        const movieToEdit = movies.find(m => m.id === editingMovieId);
            if (movieToEdit) 
                {movieToEdit.title = inputFromTitle.value;
                movieToEdit.director = inputFromDirector.value;
                movieToEdit.year = inputFromYear.value;
                editingMovieId = null;
                submitButton.textContent = "Submit"; }
            else {
                movies.push(movie);
            }
        updateMovies()
        resetForm()
}   else {
        showError()
        hideYearError()
}});
let data = localStorage.getItem("movies")
if (data) {
    movies = JSON.parse(data)
}
renderMovies()
function resetForm() {
    editingMovieId = null;
    inputFromTitle.value = '';
    inputFromDirector.value = '';
    inputFromYear.value = '';
    submitButton.textContent = "Submit";
    hideError();
    hideYearError();
    cancelEditButton.style.display = "none";
}
function showError() {
    if (!errors.contains(warn)) {
        errors.appendChild(warn)
    }
    setTimeout(hideError,2000)
}
function showYearError() {
    if (!errors.contains(validYear)) {
        errors.appendChild(validYear)
    }
    setTimeout(hideYearError,2000)
}

function hideError() {
    if (errors.contains(warn)) {
        errors.removeChild(warn)
    }
    
}
function hideYearError() {
    if (errors.contains(validYear)) {
        errors.removeChild(validYear)
    }
}
function validator() {
    let year = Number(inputFromYear.value)
    if (year >= 1888 && year <= 2026) {
        return true
    }
    return false
}
function updateMovies() {
    localStorage.setItem("movies", JSON.stringify(movies))
    renderMovies()
}
cancelEditButton.addEventListener("click", function() {
            resetForm()
        });
function renderMovies() {
    let inputFromMovieList = document.getElementById("movie-list")
    inputFromMovieList.innerHTML = "";
    let movieWarn = document.createElement("p");
    movieWarn.classList.add("movie-warn");
    if (movies.length === 0) {
        movieWarn.textContent = "No movies added yet";
        inputFromMovieList.appendChild(movieWarn)
        return
    }

    let moviesToRender = movies;
    let normalizedSearch = searchValue.toLowerCase().trim()
    
        if (normalizedSearch.length === 0) {
            moviesToRender = movies
        } else {
            moviesToRender = movies.filter((movie) =>  (movie.title.toLowerCase().includes(normalizedSearch) || movie.director.toLowerCase().includes(normalizedSearch)))
            if (moviesToRender.length === 0) {
                movieWarn.textContent = "No movies found";
                inputFromMovieList.appendChild(movieWarn)
                return
            }
        }
    
    for (let i = 0; i < moviesToRender.length;i++) {
    let movie = moviesToRender[i]
    let header = document.createElement("div")
    let body = document.createElement("div")
    let card = document.createElement("div")
    let title = document.createElement("h3")
    let director = document.createElement("p")
    let year = document.createElement("span")
    let deleteButton = document.createElement("button")
    let editButton = document.createElement("button")
    let action = document.createElement("div")
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("deleteButton")
    deleteButton.addEventListener("click",function() {
        movies = movies.filter(m => m.id !== movie.id)
        updateMovies()
    })
    editButton.textContent = "Edit"
    editButton.classList.add("editButton")
    editButton.addEventListener("click",function() {
        submitButton.textContent = "Save changes";
        cancelEditButton.style.display = "block";

        editingMovieId = movie.id;
        inputFromTitle.value = movie.title;
        inputFromDirector.value = movie.director;
        inputFromYear.value = movie.year})
    title.textContent = movie.title
    director.textContent = movie.director
    year.textContent = movie.year
        
    header.appendChild(title)
    header.classList.add("topTitle")     
    body.appendChild(director)
    body.appendChild(year)
    body.classList.add("bodyT")
    action.appendChild(deleteButton)
    action.classList.add("cardActions")
    action.appendChild(editButton)
    editButton.classList.add("editButton")
    card.appendChild(header)
    card.appendChild(body)
    card.appendChild(action)
    card.classList.add("filmCard")
    inputFromMovieList.appendChild(card) 
    }
}
