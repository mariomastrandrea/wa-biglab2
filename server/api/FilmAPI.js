const express = require('express');
const router = express.Router();

const {
   getAllFilms,
   getFilmsByFilter,
   getFilm,
   createFilm,
   updateFilm,
   updateFilmField,
   deleteFilm
} = require("../controller/FilmsController");

const isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authorized' });
   }
   
   return next();
}

router.get("/", isLoggedIn, getAllFilms);
router.get("/filter/:filter", isLoggedIn, getFilmsByFilter);
router.get("/:filmId", isLoggedIn, getFilm);
router.post("/", isLoggedIn, createFilm);
router.put("/:filmId", isLoggedIn, updateFilm);
router.patch("/:filmId", isLoggedIn, updateFilmField);
router.delete("/:filmId", isLoggedIn, deleteFilm);

module.exports = router;