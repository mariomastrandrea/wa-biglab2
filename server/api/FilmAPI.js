const express = require('express');
const router = express.Router();

const {
    getAllFilms,
    getFilmsByFilter,
    getFilm,
    createFilm,
    updateFilm,
    setFilmFavorite,
    deleteFilm
} = require("../controller/FilmsController");

router.get("/", getAllFilms);
router.get("/filter/:filter", getFilmsByFilter);
router.get("/:filmId", getFilm);
router.post("/", createFilm);
router.put("/:filmId", updateFilm);
router.patch("/:filmId", setFilmFavorite);
router.delete("/:filmId", deleteFilm);

module.exports = router;