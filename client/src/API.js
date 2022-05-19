import { Film } from "./FilmLibrary";

// it retrieves all the films existing in the backend
//    - returns an array of films if the response is successful, or 'undefined' if there was a connection error
//    - throw a TypeError if the response is not successful
async function fetchAllFilms() {
    try {
        // GET
        const response = await fetch("http://localhost:3001/api/films");

        if(!response.ok) {
            // application error (400-599)
            const errorText = await response.text();
            throw TypeError(errorText);
        }

        // response is ok (200)
        const films = await response.json();
        return films.map(film => new Film(film.id, film.title, film.favorite, film.watchdate, film.rating));
    }
    catch (error) {
        // network error...
        console.log(error);
    }
}

async function fetchFilteredFilms(filter) {
    try {
        // GET
        const response = await fetch(`http://localhost:3001/api/films/filter/${filter}`);

        if(!response.ok) {
            // application error (400-599)
            const errorText = await response.text();
            throw TypeError(errorText);
        }

        // response is ok (200)
        const filteredFilms = await response.json();
        return filteredFilms.map(film => new Film(film.id, film.title, film.favorite, film.watchdate, film.rating));
    }
    catch (error) {
        // network error...
        console.log(error);
    }
}

export { fetchAllFilms, fetchFilteredFilms };