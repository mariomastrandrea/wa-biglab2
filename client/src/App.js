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
   updateFilm, deleteFilm, fetchFilm } from './API';

function App() {
   // states
   const [films, setFilms] = useState([]);
   const [filters, setFilters] = useState([]);
   const [headers, setHeaders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");

   function getFilmsFilteredBy(filter) {
      return new Promise((resolve, reject) => {
         setTimeout(async () => {   // to simulate a long request
            try {
               const films = filter === 'all' ?
               await fetchAllFilms() : await fetchFilteredFilms(filter);
               setFilms(films);
               resolve();
            }
            catch(err) {
               reject(err);
            }
         }, 
         2000);
      });
   }

   // at first, get all films from the server
   useEffect(() => {
      setFilters(loadFilters());
      setHeaders(loadFilmHeaders());
   }, []);

   function addFilm(film) {
      return new Promise((resolve, reject) => {
         setTimeout(async () => {   // to simulate a long request
            try {
               await storeNewFilm(film);
               await getFilmsFilteredBy('all');
               setLoading(false);
               resolve(true);
            }
            catch(err) {
               reject(err);
            }
         }, 2000);
      });
   }

   function editFilm(film) {
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
         }, 2000);
      });
   }

   function getFilm(id) {
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            setErrorMessage("");
            setSuccessMessage("");
            let film;

            try {
               film = await fetchFilm(id);
            }
            catch(err) {
               reject(err);
            }

            resolve(film);
         }, 2000);
      });
   };

   // * TODO: integrate API call (using deleteFilm()) instead of 
   // modifying the films state, and then update all films *
   function deleteFilm(id) {
      setFilms(old => old.filter((film) => film.id !== id));
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
                     deleteFilm={deleteFilm}
                     getFilmsFilteredBy={getFilmsFilteredBy}
                     loading={loading}
                     setLoading={setLoading}
                     errorMessage={errorMessage}
                     setErrorMessage={setErrorMessage}
                     successMessage={successMessage}
                     setSuccessMessage={setSuccessMessage}
                     editFilm={editFilm}
                  />
               } />

               <Route path="/:activeFilter" element={
                  <Home
                     filters={filters}
                     headers={headers}
                     films={films}
                     deleteFilm={deleteFilm}
                     getFilmsFilteredBy={getFilmsFilteredBy}
                     loading={loading}
                     setLoading={setLoading}
                     errorMessage={errorMessage}
                     setErrorMessage={setErrorMessage}
                     successMessage={successMessage}
                     setSuccessMessage={setSuccessMessage}
                     editFilm={editFilm}
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
            </Routes>
         </Container>
      </BrowserRouter>
   );
}

export default App;
