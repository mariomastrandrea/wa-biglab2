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
   updateFilm, updateFilmFavorite, deleteFilmbyId, fetchFilm } from './API';

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
         1000);
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
         }, 1000);
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
         }, 1000);
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
         }, 1000);
      });
   };

   //integrate API call (using updateFilmFavorite()) instead of 
   // modifying the films state, and update all films *
   function setFilmFavorite(id, favorite) {
      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            const res = await updateFilmFavorite(id, favorite);
            if(res===null) {
               setErrorMessage("Error when updating film favorite");
               reject(false);
            }

            //fetch the updated film and edit the state
            const updatedFilm = await getFilm(id);
            setFilms((oldFilms) => {
               return oldFilms.map(film => {
                  if(film.id === updatedFilm.id) {
                     return updatedFilm;
                  }
                  else
                     return film;
               });
            });
            resolve(true);
         }, 1000);
      });
   }

   // * TODO: integrate API call (using updateFilm()) instead of 
   // modifying the films state, and then update all films *
   function setFilmRating(id, newRating) {
    
      return new Promise((resolve,reject)=>{
         setTimeout(async()=>{
            let film= await getFilm(id);
            if(film===undefined)
            {
               reject(false);
            }
            //if the rating is the same of the old one i should not call any db function
            if(film.rating===newRating){
               reject(false);
            }
            film.rating=newRating;
            await updateFilm(film);
            setFilms((oldFilms)=>{
               return oldFilms.map(x=>{
                  if(x.id===id){
                     return film;
                  }
                  else{
                     return x;
                  }
               });
            });
            resolve(true);
         },0);
      })
      
   }

   // * TODO: integrate API call (using deleteFilm()) instead of 
   // modifying the films state, and then update all films *
   function deleteFilm(id) {
      return new Promise((resolve,reject)=>{
         setTimeout(async()=>{
            let response= await deleteFilmbyId(id);
            if(response===true){
               setLoading(false);
               setFilms((oldFilms)=>oldFilms.filter(x=>x.id!=id));
               resolve(true);
            }
            else{
               reject(false);
            }

         },1000);
      })
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
            </Routes>
         </Container>
      </BrowserRouter>
   );
}

export default App;
