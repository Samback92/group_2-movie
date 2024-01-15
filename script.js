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

    movieInfo.appendChild(title);
    movieInfo.appendChild(overview);
    movieInfo.appendChild(releaseDate);
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
