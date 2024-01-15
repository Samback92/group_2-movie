let movieList = document.getElementById("movieList");
let movieInfo = document.getElementById("movieInfo");

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
    const searchInput = document.getElementById('searchInput').value;

    // Check if the search input is not empty
    if (searchInput.trim() !== '') {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&api_key=88d6f906b386ac47c004701d8f545df8`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching data:', error));
    } else {
      alert('Please enter a movie title.');
    }
  }

  
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    const movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; // Clear previous movie list

    results.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.title;

        // Add click event to show movie details when clicked
        listItem.addEventListener('click', () => showMovieDetails(movie.id));

        movieList.appendChild(listItem);
    });
}

function showMovieDetails(movieId) {
    const apiKey = '88d6f906b386ac47c004701d8f545df8'; // Replace with your Movie Database API key
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;


    fetch(apiUrl)
        .then(response => response.json())
        .then(movie => displayMovieDetails(movie))
        .catch(error => console.error('Error fetching movie details:', error));
}

function displayMovieDetails(movie) {
    const movieInfo = document.getElementById('movieInfo');
    movieInfo.innerHTML = ''; // Clear previous movie details

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date}`;

    const movieImg = document.createElement("img");
    movieImg.style.width = "500px";
    movieImg.src = "https://image.tmdb.org/t/p/original/" + movie.poster_path;

    movieInfo.appendChild(title);
    movieInfo.appendChild(overview);
    movieInfo.appendChild(releaseDate);
    movieInfo.appendChild(movieImg);
}

function printMovieInfo(movie) {
    movieInfo.innerHTML = "";
    console.log("movie info", movie);

    let movieDiv = document.createElement("div");
    let movieHeadline = document.createElement("h2");
    movieHeadline.innerText = movie.original_title;

    let movieText = document.createElement("p");
    movieText.innerText = movie.overview;

    let movieImg = document.createElement("img");
    movieImg.style.width= "500px";
    movieImg.src = "https://image.tmdb.org/t/p/original/" + movie.poster_path;

    movieDiv.append(movieHeadline, movieText, movieImg);
    movieInfo.appendChild(movieDiv);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGenres();
});

function fetchGenres() {
    const apiKey = '88d6f906b386ac47c004701d8f545df8';
    const genreSelect = document.getElementById('genreSelect');
    const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = 'Select a genre';
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
        alert('Please select a genre.');
    }
}

