const dbConnection = require("./Database");
const Film = require("../models/Film");
const dayjs = require("dayjs");

class FilmDAO {
   #db;
   static instance;    // singleton instance

   constructor() {
      this.#db = dbConnection;
   }

   static getFilmDAOInstance() {
      if (!FilmDAO.instance) {
         FilmDAO.instance = new FilmDAO();
      }
      return FilmDAO.instance;
   }

   // returns an array containing all the existing films in the DB
   getAll(userId) {
      return new Promise((resolve, reject) => {
         const sqlQuery = `SELECT id, title, favorite, watchdate, rating 
                           FROM films
                           WHERE user=?`;

         this.#db.all(sqlQuery, [userId], (err, rows) => {
            if (err)
               reject(err);
            else
               resolve(rows.map(row =>
                  new Film(row.id, row.title, !!row.favorite, row.watchdate, row.rating)));
         });
      });
   }

   // returns an array containing all the films satisfying the specified filter
   getFilmsByFilter(filter, userId) {
      let sql;
      let args = [userId];

      switch (filter) {
         case "all":
            sql = "SELECT * FROM films WHERE user=?";
            break;
         case "favorite":
            sql = "SELECT * FROM films WHERE favorite=1 AND user=?";
            break;
         case "best-rated":
            sql = "SELECT * FROM films WHERE rating=5 AND user=?";
            break;
         case "unseen":
            sql = "SELECT * FROM films WHERE watchdate IS NULL AND user=?";
            break;
         case "seen-last-month":
            sql = "SELECT * FROM films WHERE user=?";
         default:
            sql = "SELECT * FROM films WHERE user=?";
            break;
      }

      return new Promise((resolve, reject) => {
         this.#db.all(sql, args, (err, rows) => {
            if (err) {
               reject(err);
               return;
            }

            //a very dirty workaround because the date is stored in the DB as text
            if (filter === "seen-last-month")
               resolve(rows.filter(
                  row => {
                     const diff = dayjs().diff(dayjs(row.watchdate), 'day');
                     return diff >= 0 && diff <= 30
                  }
               ).map(
                  row => new Film(row.id, row.title, !!row.favorite, row.watchdate, row.rating)
               ));
            else
               resolve(rows.map(row =>
                  new Film(row.id, row.title, !!row.favorite, row.watchdate, row.rating)));
         });
      });
   }

   // retrieve a film given its id
   getFilm(id, userId) {
      return new Promise((resolve, reject) => {
         const sqlQuery = `SELECT id, title, favorite, watchdate, rating
                           FROM films
                           WHERE id=? AND user=?`;

         this.#db.get(sqlQuery, [id, userId], (err, row) => {
            if (err)
               reject(err);
            else if (!row)
               resolve(null);
            else
               resolve(new Film(row.id, row.title, !!row.favorite, row.watchdate, row.rating));
         })
      });
   }

   // creates a new persistent Film in the DB and returns the new Film object with its assigned ID
   create(newFilm, userId) {
      const newTitle = newFilm.title;
      const newFavorite = newFilm.favorite;
      const newWatchdate = newFilm.watchdate;
      const newRating = newFilm.rating ?? 0;

      return new Promise((resolve, reject) => {
         const sqlStatement = `INSERT INTO films(title, favorite, watchdate, rating, user)
                               VALUES (?, ?, ?, ?, ?)`;

         const params = [newTitle, newFavorite ? 1 : 0, newWatchdate, newRating, userId];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(new Film(this.lastID, newTitle, newFavorite, newWatchdate, newRating));
         });
      });
   }

   // update the provided film with the information contained in it
   // returns 'true' if the film was successfully updated; 'false' otherwise
   update(newFilm, userId) {
      const filmId = newFilm.id;
      const newTitle = newFilm.title;
      const newFavorite = newFilm.favorite;
      const newWatchdate = newFilm.watchdate;
      const newRating = newFilm.rating ?? 0;

      return new Promise((resolve, reject) => {
         const sqlStatement = `UPDATE films 
                               SET title=?, favorite=?, watchdate=?, rating=?, user=?
                               WHERE id=?`;

         const params = [newTitle, newFavorite ? 1 : 0, newWatchdate, newRating, userId, filmId];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }

   deleteFilm(id, userId) {
      return new Promise((resolve, reject) => {
         const sql = `DELETE FROM films 
                      WHERE id=? AND user=?`;
         
         this.#db.run(sql, [id, userId], function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }
}

module.exports = FilmDAO.getFilmDAOInstance;