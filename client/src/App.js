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

const filmFilters = loadFilters();
const filmHeaders = loadFilmHeaders();


function App() {
    // states
    const [films, setFilms] = useState([]);
    const filters = useState(filmFilters)[0];
    const headers = useState(filmHeaders)[0];
    const [loading, setLoading] = useState(true)

    //get all films
    /*useEffect(() => {
        const getFilms = async () => {
            const films = await fetchFilteredFilms("all");
            setFilms(films);
            setLoading(false);
        }
        getFilms();
    }, []);*/

    function addFilm(film) {
        setFilms((old) => [...old, film]);
    }

    function deleteFilm(id) {
        setFilms((old) => old.filter((film) => film.id !== id));
    }

    function setFilmRating(id, newRating) {
        setFilms((old) => old.map(film => {
            let newFilm = { ...film };

            if (film.id === id)
                newFilm.rating = newRating;

            return newFilm;
        }));
    }

    function setFilmFavorite(id, favorite) {
        setFilms((old) => old.map(film => {
            let newFilm = { ...film };

            if (film.id === id)
                newFilm.favorite = favorite;

            return newFilm;
        }));
    }

    function editFilm(film) {
        setFilms((old) => old.map(oldFilm => {
            if (oldFilm.id === film.id)
                return film;

            return oldFilm;
        }))
    }

    // render the page only if the films loading is finished
    return (
        <Container fluid className="vh-100">
            <BrowserRouter>
                <Routes>
                    {!loading ? <>
                        <Route index element={
                            <Home
                                filters={filters}
                                setFilmFavorite={setFilmFavorite}
                                setFilmRating={setFilmRating}
                                deleteFilm={deleteFilm}
                                headers={headers}
                                films={films}
                                activeFilter={"all"}
                                setFilms={setFilms}
                                setLoading={setLoading}
                            />
                        } />

                        <Route path="/:activeFilter" element={
                            <Home
                                filters={filters}
                                setFilmFavorite={setFilmFavorite}
                                setFilmRating={setFilmRating}
                                deleteFilm={deleteFilm}
                                headers={headers}
                                films={films}
                                setFilms={setFilms}
                                setLoading={setLoading}
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
                                films={films}
                            />
                        } />
                        </> : <></>
                    }
                </Routes>
            </BrowserRouter>
        </Container>
    );
}

export default App;
