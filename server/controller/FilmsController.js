const res = require("express/lib/response");
const getFilmDAOInstance = require("../dao/FilmDAO");
const filmDAO = getFilmDAOInstance();

async function getAllFilms(req, res) {
    try {
        const films = await filmDAO.getAll();
        res.status(200).json(films);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Generic database error",
        });
    }
}

async function getFilm(req, res) {
    try {
        const film = await filmDAO.getFilm(req.params.filmId);
        if(film===undefined) {
            res.status(404).end();
        }
        else
        {
            res.status(200).json(film);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Generic database error",
        });
    }
}

async function getFilmsByFilter(req, res) {
    try {
        const film = await filmDAO.getFilmByFilter(req.params.filter);
        if(film===undefined) {
            res.status(404).end();
        }
        else
        {
            res.status(200).json(film);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Generic database error",
        });
    }
}

/*
TODO: functions to be implemented:
    getFilmsByFilter,
    getFilm,
    createFilm,
    updateFilm,
    setFilmFavorite,
    deleteFilm
*/

module.exports = { 
   getAllFilms,
   getFilmsByFilter,
   getFilm,
   //createFilm,
   //updateFilm,
   //setFilmFavorite,
   //deleteFilm 
};