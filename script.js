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

    movies.results.forEach(movie => {
console.log("movie", movie);
        let li = document.createElement("li");
        li.innerText = movie.original_title;

        li.addEventListener("click", () => {

            printMovieInfo(movie);
        })

        movieList.appendChild(li);
    });

}

function searchMovies() {
    let searchInput = document.getElementById('searchInput').value;

    if (searchInput.trim() !== '') {
        let apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&api_key=88d6f906b386ac47c004701d8f545df8`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayResults(data.results))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('You did not enter a movie title.');
    }
}


function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    let movieList = document.getElementById('movieList');
    movieList.innerHTML = '';

    results.forEach(movie => {
        let listItem = document.createElement('li');
        listItem.textContent = movie.title;

        listItem.addEventListener('click', () => showMovieDetails(movie.id));

        movieList.appendChild(listItem);
    });
}

function showMovieDetails(movieId) {
    let apiKey = '88d6f906b386ac47c004701d8f545df8';
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
    releaseDate.textContent = `Utgivningsdatum: ${movie.release_date}`;

    let movieImg = document.createElement("img");
    movieImg.style.width= "400px";
    movieImg.src = "https://image.tmdb.org/t/p/original/" + movie.poster_path;

    let favButton = document.createElement('button');
    favButton.innerText = localStorage.getItem(movie.id) ? 'Remove from favorites' : 'Add to favorites';

favButton.addEventListener('click', function() {
    if (localStorage.getItem(movie.id)) {
 
        localStorage.removeItem(movie.id);
        favButton.innerText = 'Add to favorites';
    } else {
   
        localStorage.setItem(movie.id, JSON.stringify(movie));
        favButton.innerText = 'Remove from favorites';
    }

    updateFavoritesButtonVisibility();
    showFavorites();
});


    movieDiv.append(movieHeadline, movieText, releaseDate, favButton, movieImg);
    movieInfo.appendChild(movieDiv);
}

    let toggleFavoritesButton = document.getElementById('toggleFavorites');
    let toggleClearFavoritesBtn = document.getElementById("toggleClearFavoritesBtn")
    let favoritesDiv = document.getElementById('favorites');

function updateFavoritesButtonVisibility() {
    let favorites = Object.keys(localStorage);
    if (favorites.length > 0) {
        toggleFavoritesButton.style.display = 'block';
        toggleClearFavoritesBtn.style.display = 'block';
        
    } else {
        toggleFavoritesButton.style.display = 'none';
        toggleClearFavoritesBtn.style.display = 'none';
    }
}

function showFavorites() {
    favoritesDiv.innerHTML = '';
    let favorites = Object.keys(localStorage);
    favorites.forEach(id => {
        let movie = JSON.parse(localStorage.getItem(id));
        let li = document.createElement('li');
        toggleFavoritesButton.innerText = "Hide favorites";
        li.innerText = movie.original_title;
        li.addEventListener('click', () => printMovieInfo(movie));
        favoritesDiv.appendChild(li);
    });
}

function hideFavorites() {
    favoritesDiv.innerHTML = '';
    toggleFavoritesButton.innerText = "Show favorites";
}

toggleFavoritesButton.addEventListener('click', function() {
    if (favoritesDiv.innerHTML === '') {
        showFavorites();
    } else {
        hideFavorites();
    }
});

updateFavoritesButtonVisibility();

function clearFavorites() {
    let confirmClear = confirm("Are you sure you want to clear favorites?")
    if (confirmClear) {

        localStorage.clear();

        updateFavoritesButtonVisibility();
        hideFavorites();

        let movieInfoButtons = document.querySelectorAll('#movieInfo button');
        movieInfoButtons.forEach(button => {
            button.innerText = 'Add to favorites';

        });
    }
}

function fetchGenres() {
    const apiKey = '88d6f906b386ac47c004701d8f545df8';
    const genreSelect = document.getElementById('genreSelect');
    const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = 'Choose a genre';
    genreSelect.appendChild(emptyOption);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.text = genre.name;
                genreSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching genres:', error));
}


function searchByGenre() {
    const selectedGenreId = document.getElementById('genreSelect').value;

    if (selectedGenreId) {
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenreId}&api_key=88d6f906b386ac47c004701d8f545df8`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayResults(data.results))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('You did not choose a genre.');
    }
}

fetchGenres();