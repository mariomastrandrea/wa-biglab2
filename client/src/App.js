import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { loadFilters, loadFilmHeaders } from "./FilmLibrary.js";
import Home from "./routes/Home";
import NewFilmPage from "./routes/NewFilmPage";
import EditFilmPage from "./routes/EditFilmPage";
import { fetchAllFilms, fetchFilteredFilms, storeNewFilm, 
   updateFilm, setFilmFavorite, deleteFilm, fetchFilm } from './API';

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
      setFilters(loadFilters());
      setHeaders(loadFilmHeaders());
   }, []);

   async function addFilm(film) {
      await storeNewFilm(film);
   }

   async function editFilm(film) {
      await editFilm(film);
   }

   async function getFilm(id) {
      return await fetchFilm(id);
   };

   // TODO: integrate API calls below

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
                     setLoading={setLoading}
                  />
               } />

               <Route path="/editFilm/:filmId" element={
                  <EditFilmPage
                     editFilm={editFilm}
                     getFilm={getFilm}
                     setLoading={setLoading}
                     loading={loading}
                     errorMessage={errorMessage}
                  />
               } />
            </Routes>
         </Container>
      </BrowserRouter>
   );
}

export default App;
