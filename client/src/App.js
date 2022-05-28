import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { loadFilters, loadFilmHeaders } from "./FilmLibrary.js";
import Home from "./routes/Home";
import NewFilmPage from "./routes/NewFilmPage";
import EditFilmPage from "./routes/EditFilmPage";
import { fetchAllFilms, fetchFilteredFilms } from './API';

function App() {
   // states
   const [films, setFilms] = useState([]);
   const [filters, setFilters] = useState([]);
   const [headers, setHeaders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");

   async function getFilmsFilteredBy(filter) {
      const films = filter === 'all' ?
         await fetchAllFilms() : await fetchFilteredFilms(filter);
      setFilms(films);
   }

   // at first, get all films from the server
   useEffect(() => {
      setLoading(true);

      setTimeout(async () => {   // simulate a long request
         getFilmsFilteredBy('all').then(() => setLoading(false)).catch(() => {
            setErrorMessage("An error occurred retrieving film from the server");
            setLoading(false);
         });
      }, 2000);

      setFilters(loadFilters());
      setHeaders(loadFilmHeaders());
   }, []);

   // TODO: integrate API calls below

   function addFilm(film) {
      setFilms(old => [...old, film]);
   }

   function deleteFilm(id) {
      setFilms(old => old.filter((film) => film.id !== id));
   }

   function setFilmRating(id, newRating) {
      setFilms(old => old.map(film => {
         let newFilm = { ...film };

         if (film.id === id)
            newFilm.rating = newRating;

         return newFilm;
      }));
   }

   function setFilmFavorite(id, favorite) {
      setFilms(old => old.map(film => {
         let newFilm = { ...film };

         if (film.id === id)
            newFilm.favorite = favorite;

         return newFilm;
      }));
   }

   function editFilm(film) {
      setFilms(old => old.map(oldFilm => {
         if (oldFilm.id === film.id)
            return film;

         return oldFilm;
      }))
   }

   async function getFilm(id) {
      return films.find(f => f.id === id);
   };

   // render the page only if the films loading is finished
   return (
      <BrowserRouter>
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
                  />
               } />

               <Route path="/addFilm" element={
                  <NewFilmPage
                     addFilm={addFilm}
                  />
               } />

               <Route path="/editFilm/:filmId" element={
                  <EditFilmPage
                     editFilm={editFilm}
                     getFilm={getFilm}
                     loading={loading}
                  />
               } />
            </Routes>
         </Container>
      </BrowserRouter>
   );
}

export default App;
