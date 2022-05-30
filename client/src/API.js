import { Film } from "./FilmLibrary";
const APIurl = "http://localhost:3001/api/";

/** It retrieves all the films existing in the backend 
 * - returns an array of films if the response is successful
 * - throw an error if the response is not successful or if there was a connection error
 */
async function fetchAllFilms() {
   try {
      // GET
      const response = await fetch(`${APIurl}films`);

      if (!response.ok) {
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
      throw error;
   }
}

async function fetchFilm(filmId) {
   try {
      // GET
      const response = await fetch(`${APIurl}films/${filmId}`);

      if (response.status === 404) {
         return null;
      }
      else if (!response.ok) {
         // application error (400-599)
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      // response is ok (200)
      const film = await response.json();
      return new Film(film.id, film.title, film.favorite, film.watchdate, film.rating);
   }
   catch (error) {
      // network error...
      console.log(error);
      throw error;
   }
}

/** It retrieves filtered films from the backend 
 * - returns an array of filtered films if the response is successful
 * - throw an error if the response is not successful or if there was a connection error
 */
async function fetchFilteredFilms(filter) {
   try {
      // GET
      const response = await fetch(`${APIurl}films/filter/${filter}`);

      if (!response.ok) {
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
      throw error;
   }
}

/**
 * It stores a new film object persistently in the backend
 * - returns 'true' if the store is successfully executed; throw an exception otherwise
 */
async function storeNewFilm(film) {
   try {
      const response = await fetch(`${APIurl}films`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            title: film.title,
            favorite: film.favorite,
            watchdate: film.watchdate?.format("YYYY-MM-DD") ?? null,
            rating: film.rating
         })
      });

      if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      return true;
   }
   catch (err) {
      // network connection error
      console.log(err);
      throw err;
   }
}

/**
 * It updates an existing film object persistently in the backend
 * - returns 'true' if the update is successfully executed; throw an exception otherwise
 */
async function updateFilm(film) {
   try {
      const response = await fetch(`${APIurl}films/${film.id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            title: film.title,
            favorite: film.favorite,
            watchdate: film.watchdate?.format("YYYY-MM-DD") ?? null,
            rating: film.rating
         })
      });

      if (response.status === 404) {
         return null;
      }
      else if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      return true;
   }
   catch (err) {
      // network connection error
      console.log(err);
      throw err;
   }
}


async function updateFilmFavorite(id, favorite) {
   try {
      const response = await fetch(`${APIurl}films/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            favorite: favorite,
         })
      });

      if (response.status === 404) {
         return null;
      }
      else if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      return true;
   } catch (err) {
      // network connection error
      console.log(err);
      throw err;
   }
}

async function deleteFilmById(filmId) {
   try {
      const response = await fetch(`${APIurl}films/${filmId}`, {
         method: "DELETE"
      });

      if (response.status === 404) {
         return null;
      }
      else if (!response.ok) {
         // application error
         const errorText = await response.text();
         throw TypeError(errorText);
      }

      return true;
   }
   catch (err) {
      console.log(err);
      throw err;
   }
}

export {
   fetchAllFilms,
   fetchFilteredFilms,
   storeNewFilm,
   updateFilm,
   updateFilmFavorite,
   deleteFilmById,
   fetchFilm
};