const getFilmDAOInstance = require("../dao/FilmDAO");
const { isInt, isNum, int } = require("../utilities");
const filmDAO = getFilmDAOInstance();

const Film = require("../models/Film");

// GET /films
async function getAllFilms(req, res) {
   try {
      const userId = req.user.id;
      const films = await filmDAO.getAll(userId);
      return res.status(200).json(films);
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error",
      });
   }
}

// GET /films/:filmId
async function getFilm(req, res) {
   try {
      let { filmId } = req.params;

      if (!filmIdIsValid(filmId)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid URL parameter"
         });
      }

      const userId = req.user.id;
      filmId = int(filmId);
      const film = await filmDAO.getFilm(filmId, userId);

      if (!film) {
         return res.status(404).end();
      }

      return res.status(200).json(film);
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Generic database error",
      });
   }
}

// GET /films/filter/:filter
async function getFilmsByFilter(req, res) {
   try {
      const userId = req.user.id;
      const film = await filmDAO.getFilmsByFilter(req.params.filter, userId);

      if (film === undefined) {
         return res.status(404).end();
      }

      return res.status(200).json(film);
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Generic database error",
      });
   }
}

// POST /films
// request body: a json containing 'title'(string), 'favorite'(boolean), 'watchdate(string)' and 'rating(0-5)' properties
async function createFilm(req, res) {
   try {
      // validate request body
      const { title, favorite, watchdate, rating } = req.body;

      if (!titleIsValid(title) || !favoriteIsValid(favorite) ||
         !watchdateIsValid(watchdate) || !ratingIsValid(rating)) {
         return res.status(422).json({
            error: "Unprocessable Entity"
         });
      }

      const userId = req.user.id;

      // * create new film *
      const newFilm = new Film(null, title, favorite, watchdate, rating);
      const newCreatedFilm = await filmDAO.create(newFilm, userId);

      if (!newCreatedFilm) {   // a generic error occurred during creation
         return res.status(500).json({
            error: "Internal Server Error - Generic error occurred during creation"
         });
      }

      // film was successfully created
      return res.status(201).send("Created");
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error"
      });
   }
}

// PUT /films/:filmId
// request body: a json containing 'title'(string), 'favorite'(boolean), 'watchdate(string)' and 'rating(0-5)' properties
async function updateFilm(req, res) {
   try {
      // validate URL parameter
      let { filmId } = req.params;

      if (!filmIdIsValid(filmId)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid URL parameter"
         });
      }

      filmId = int(filmId);   // convert string to number

      // validate request body
      const { title, favorite, watchdate, rating } = req.body;

      if (!titleIsValid(title) || !favoriteIsValid(favorite) ||
         !watchdateIsValid(watchdate) || !ratingIsValid(rating)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid request body"
         });
      }

      const userId = req.user.id;

      // check film existence 
      const film = await filmDAO.getFilm(filmId, userId); 

      if (!film) {    // film not found
         return res.status(404).json({
            error: "Film not found"
         });
      }

      // * update film *
      const newFilm = new Film(filmId, title, favorite, watchdate, rating);
      const wasFilmUpdated = await filmDAO.update(newFilm, userId);

      if (!wasFilmUpdated) {   // a generic error occurred during update
         return res.status(500).json({
            error: "Internal Server Error - Generic error occurred during update"
         });
      }

      // film was successfully update
      return res.status(200).send("Ok");
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({
         error: "Internal Server Error"
      });
   }
}

//PATCH /:filmId
//basically it calls an update film function with the new Favorite setted
async function setFilmFavorite(req, res) {
   try {
      let { filmId } = req.params;

      if (!filmIdIsValid(filmId)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid URL parameter"
         });
      }
      if (!favoriteIsValid(req.body.favorite)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid favorite body parameter"
         });
      }

      const userId = req.user.id;
      let film = await filmDAO.getFilm(filmId, userId);

      if (!film) {    // film not found
         return res.status(404).json({
            error: "Film not found"
         });
      }

      film.favorite = req.body.favorite;
      await filmDAO.update(film, userId);

      return res.status(200).send("Favorite setted");
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server Error" });
   }
}

async function deleteFilm(req, res) {
   try {
      let { filmId } = req.params;

      if (!filmIdIsValid(filmId)) {
         return res.status(422).json({
            error: "Unprocessable Entity - Invalid URL parameter"
         });
      }

      const userId = req.user.id;
      const film = await filmDAO.getFilm(filmId, userId);

      if(!film) {
         return res.status(404).json({
            error: "Film not found"
         });
      }

      await filmDAO.deleteFilm(filmId, userId);
      return res.status(204).send("No content");
   }
   catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server Error" });
   }
}


/* functions useful for validation purposes */
// #region 

// a string containing an Integer
function filmIdIsValid(filmId) {
   return isInt(filmId);
}

// not empty string
function titleIsValid(title) {
   return title &&
      typeof title === 'string';
}

// accepted values: 'true' or 'false'
function favoriteIsValid(favorite) {
   return typeof favorite === 'boolean';
}

// accepted date format: YYYY-MM-DD or null
function watchdateIsValid(watchdate) {
   return watchdate === null ||
      (typeof watchdate === 'string' &&
         /^[\d]{4}-[\d]{2}-[\d]{2}$/.test(watchdate));
}

// integer in [0,5]
function ratingIsValid(rating) {
   return rating === null || 
      (isNum(rating) && isInt(rating) &&
         rating >= 0 && rating <= 5);
}
// #endregion

module.exports = {
   getAllFilms,
   getFilmsByFilter,
   getFilm,
   createFilm,
   updateFilm,
   setFilmFavorite,
   deleteFilm
};
