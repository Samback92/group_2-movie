let movieList = document.getElementById("movieList");
let movieInfo = document.getElementById("movieInfo");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

console.log("Hej");
fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=88d6f906b386ac47c004701d8f545df8")
.then(res => res.json())
.then(data => {

    printMovieList(data);
})

function printMovieList(movies) {
//console.log("movie list", movies);

    movies.results.forEach(movie => {
console.log("movie", movie);
        let li = document.createElement("li");
        li.innerText = movie.original_title;

        li.addEventListener("click", () => {
//console.log("klick på knapp", movie.id);
            printMovieInfo(movie);
        })

        movieList.appendChild(li);
    });

}

function searchMovies() {
    let searchInput = document.getElementById('searchInput').value;

    // Check if the search input is not empty
    if (searchInput.trim() !== '') {
        let apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&api_key=88d6f906b386ac47c004701d8f545df8`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayResults(data.results))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('Please enter a movie title.');
    }
}


function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    let movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; // Clear previous movie list

    results.forEach(movie => {
        let listItem = document.createElement('li');
        listItem.textContent = movie.title;

        // Add click event to show movie details when clicked
        listItem.addEventListener('click', () => showMovieDetails(movie.id));

        movieList.appendChild(listItem);
    });
}

function showMovieDetails(movieId) {
    let apiKey = '88d6f906b386ac47c004701d8f545df8'; // Replace with your Movie Database API key
    let apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(movie => printMovieInfo(movie))
        .catch(error => console.error('Error fetching movie details:', error));
}

function printMovieInfo(movie) {
    movieInfo.innerHTML = "";

    let movieDiv = document.createElement("div");
    let movieHeadline = document.createElement("h2");
    movieHeadline.innerText = movie.original_title;

    let movieText = document.createElement("p");
    movieText.innerText = movie.overview;

    let releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;

    let movieImg = document.createElement("img");
    movieImg.style.width= "500px";
    movieImg.src = "https://image.tmdb.org/t/p/original/" + movie.poster_path;

    let favButton = document.createElement('button');
    favButton.innerText = localStorage.getItem(movie.id) ? 'Ta bort från favoriter' : 'Lägg till i favoriter';

favButton.addEventListener('click', function() {
    if (localStorage.getItem(movie.id)) {
 
        localStorage.removeItem(movie.id);
        favButton.innerText = 'Lägg till som favorit';
    } else {
   
        localStorage.setItem(movie.id, JSON.stringify(movie));
        favButton.innerText = 'Ta bort från favoriter';
    }

    showFavorites();
});


    movieDiv.append(movieHeadline, movieText, releaseDate, favButton, movieImg);
    movieInfo.appendChild(movieDiv);
}

    let toggleFavoritesButton = document.getElementById('toggleFavorites');
    let favoritesDiv = document.getElementById('favorites');

function updateFavoritesButtonVisibility() {
    let favorites = Object.keys(localStorage);
    if (favorites.length > 0) {
        toggleFavoritesButton.style.display = 'block';
    } else {
        toggleFavoritesButton.style.display = 'none';
    }
}

function showFavorites() {
    favoritesDiv.innerHTML = '';
    let favorites = Object.keys(localStorage);
    favorites.forEach(id => {
        let movie = JSON.parse(localStorage.getItem(id));
        let li = document.createElement('li');
        li.innerText = movie.original_title;
        li.addEventListener('click', () => printMovieInfo(movie));
        favoritesDiv.appendChild(li);
    });
}

function hideFavorites() {
    favoritesDiv.innerHTML = '';
}

toggleFavoritesButton.addEventListener('click', function() {
    if (favoritesDiv.innerHTML === '') {
        showFavorites();
    } else {
        hideFavorites();
    }
});

updateFavoritesButtonVisibility();
