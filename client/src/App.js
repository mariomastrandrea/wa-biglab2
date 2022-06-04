import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { loadFilters, loadFilmHeaders } from "./FilmLibrary.js";
import Home from "./routes/Home";
import NewFilmPage from "./routes/NewFilmPage";
import EditFilmPage from "./routes/EditFilmPage";
import LoginPage from "./routes/LoginPage";
import {
   fetchAllFilms, fetchFilteredFilms, storeNewFilm,
   updateFilm, updateFilmFavorite, deleteFilmById, fetchFilm
} from './API';
import { UserProvider } from './UserContext';


function App() {
   // states
   const [films, setFilms] = useState([]);
   const [filters, setFilters] = useState([]);
   const [headers, setHeaders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");

   async function getFilmsFilteredBy(filter) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {   // to simulate a long request
            try {
               const films = filter === 'all' ?
                  await fetchAllFilms() : await fetchFilteredFilms(filter);
               setFilms(films);
               resolve(films);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      });
      */

      try {
         const films = filter === 'all' ?
            await fetchAllFilms() : await fetchFilteredFilms(filter);
         setFilms(films);
         return films;
      }
      catch (err) {
         throw err;
      }
   }

   // at first, get all films from the server
   useEffect(() => {
      setFilters(loadFilters());
      setHeaders(loadFilmHeaders());
   }, []);

   async function addFilm(film) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {   // to simulate a long request
            try {
               await storeNewFilm(film);
               await getFilmsFilteredBy('all');
               setLoading(false);
               resolve(true);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      });
      */

      try {
         await storeNewFilm(film);
         await getFilmsFilteredBy('all');
         setLoading(false);
         return true;
      }
      catch (err) {
         throw err;
      }
   }

   async function editFilm(film) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {   // to simulate a long request
            try {
               await updateFilm(film);
               await getFilmsFilteredBy('all');
               setLoading(false);
               resolve(true);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      });
      */

      try {
         await updateFilm(film);
         await getFilmsFilteredBy('all');
         setLoading(false);
         return true;
      }
      catch (err) {
         throw err;
      }
   }

   async function getFilm(id) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            setErrorMessage("");
            setSuccessMessage("");
            let film;

            try {
               film = await fetchFilm(id);
            }
            catch (err) {
               reject(err);
               return;
            }

            resolve(film);
         }, 1000);
      });
      */

      setErrorMessage("");
      setSuccessMessage("");

      try {
         const film = await fetchFilm(id);
         return film;
      }
      catch (err) {
         throw err;
      }
   };

   async function setFilmFavorite(id, favorite, activeFilter) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            try {
               const result = await updateFilmFavorite(id, favorite);

               if (result === null) {
                  setErrorMessage("Error when updating film favorite");
                  reject(false);
                  setLoading(false);
                  return;
               }

               await getFilmsFilteredBy(activeFilter);
               setLoading(false);
               resolve(true);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      });
      */

      try {
         const result = await updateFilmFavorite(id, favorite);

         if (result === null) {
            setErrorMessage("Error when updating film favorite");
            throw TypeError("Error when updating film favorite");
         }

         await getFilmsFilteredBy(activeFilter);
         setLoading(false);
         return true;
      }
      catch (err) {
         throw err;
      }
   }

   async function setFilmRating(film, newRating, activeFilter) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            film.rating = newRating;

            try {
               const result = await updateFilm(film);

               if (result === null) {
                  setErrorMessage("Error when updating film rating");
                  setLoading(false);
                  reject(false);
                  return;
               }

               await getFilmsFilteredBy(activeFilter);
               setLoading(false);
               resolve(true);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      })
      */

      film.rating = newRating;

      try {
         const result = await updateFilm(film);

         if (result === null) {
            setErrorMessage("Error when updating film rating");
            throw TypeError("Error when updating film rating");
         }

         await getFilmsFilteredBy(activeFilter);
         setLoading(false);
         return true;
      }
      catch (err) {
         throw err;
      }
   }

   async function deleteFilm(id, activeFilter) {
      /*
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            try {
               const response = await deleteFilmById(id);

               if (!response) {
                  setErrorMessage("Error when deleting film");
                  reject(false);
                  return;
               }

               await getFilmsFilteredBy(activeFilter)
               setLoading(false);
               resolve(true);
            }
            catch (err) {
               reject(err);
            }
         }, 1000);
      })
      */

      try {
         const response = await deleteFilmById(id);

         if (!response) {
            setErrorMessage("Error when deleting film");
            throw TypeError("Error when deleting film")
         }

         await getFilmsFilteredBy(activeFilter)
         setLoading(false);
         return true;
      }
      catch (err) {
         throw err;
      }
   }

   // render the page only if the films loading is finished
   return (
      <BrowserRouter>
         <UserProvider>
            <Container fluid className="vh-100">
               <Routes>
                  <Route index element={
                     <Home
                        filters={filters}
                        activeFilter={"all"}
                        headers={headers}
                        films={films}
                        setFilmFavorite={setFilmFavorite}
                        setFilmRating={setFilmRating}
                        deleteFilm={deleteFilm}
                        getFilmsFilteredBy={getFilmsFilteredBy}
                        loading={loading}
                        setLoading={setLoading}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        successMessage={successMessage}
                        setSuccessMessage={setSuccessMessage}
                     />
                  } />

                  <Route path="/:activeFilter" element={
                     <Home
                        filters={filters}
                        headers={headers}
                        films={films}
                        setFilmFavorite={setFilmFavorite}
                        setFilmRating={setFilmRating}
                        deleteFilm={deleteFilm}
                        getFilmsFilteredBy={getFilmsFilteredBy}
                        loading={loading}
                        setLoading={setLoading}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        successMessage={successMessage}
                        setSuccessMessage={setSuccessMessage}
                     />
                  } />

                  <Route path="/addFilm" element={
                     <NewFilmPage
                        addFilm={addFilm}
                        setLoading={setLoading}
                        loading={loading}
                        setErrorMessage={setErrorMessage}
                        errorMessage={errorMessage}
                        setSuccessMessage={setSuccessMessage}
                     />
                  } />

                  <Route path="/editFilm/:filmId" element={
                     <EditFilmPage
                        editFilm={editFilm}
                        getFilm={getFilm}
                        setLoading={setLoading}
                        loading={loading}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                     />
                  } />

                  <Route path="/login" element={
                     <LoginPage
                        loading={loading}
                        setLoading={setLoading}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        errorMessage={errorMessage}
                        successMessage={successMessage}
                     />
                  } />
               </Routes>
            </Container>
         </UserProvider>
      </BrowserRouter>
   );
}

export default App;
