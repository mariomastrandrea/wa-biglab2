const dbConnection = require("./Database");
const Film = require("../models/Film");
const dayjs = require("dayjs");

class FilmDAO {
   #db;
   static instance;    // singleton instance

   constructor() {
      this.db = dbConnection;
   }

   static getFilmDAOInstance() {
      if (!FilmDAO.instance) {
         FilmDAO.instance = new FilmDAO();
      }
      return FilmDAO.instance;
   }

   // returns an array containing all the existing films in the DB
   getAll() {
      return new Promise((resolve, reject) => {
         const sqlQuery = `SELECT * 
                              FROM films`;

         this.db.all(sqlQuery, (err, rows) => {
            if (err)
               reject(err);
            else
               resolve(rows.map(row =>
                  new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
         });
      });
   }

   // returns an array containing all the films satisfying the specified filter
   getFilmsByFilter(filter) {
      let sql;
      let args = new Array();

      switch (filter) {
         case "all":
            sql = "SELECT * FROM films";
            break;
         case "favorite":
            sql = "SELECT * FROM films WHERE favorite=1";
            break;
         case "best-rated":
            sql = "SELECT * FROM films WHERE rating=5";
            break;
         case "unseen":
            sql = "SELECT * FROM films WHERE watchdate IS NULL";
            break;
         case "seen-last-month":
            sql = "SELECT * FROM films";
         default:
            sql = "SELECT * FROM films";
            break;
      }

      return new Promise((resolve, reject) => {
         this.db.all(sql, args, (err, rows) => {
            if (err) {
               return reject(err);
            }

            //a very dirty workaround because the date is stored in the DB as text
            if (filter === "seen-last-month")
               return resolve(rows.filter(
                  row => dayjs().diff(dayjs(row.watchdate), 'day') <= 30
               ).map(
                  row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)
               ));

            return resolve(rows.map(row =>
               new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
         });
      });
   }

   // retrieve a film given its id
   getFilm(id) {
      return new Promise((resolve, reject) => {
         this.db.get("SELECT * FROM films WHERE id=?", [id], (err, row) => {
            if (err) {
               reject(err);
            }
            else if (!row) 
               return null;
            else
               resolve(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
         })
      });
   }

   // creates a new persistent Film in the DB and returns the new Film object with its assigned ID
   create(newFilm) {
      const newTitle = newFilm.title;
      const newFavorite = newFilm.favorite;
      const newWatchdate = newFilm.watchdate;
      const newRating = newFilm.rating;
      const newUser = 1;  // * temporary arbitrary data *

      return new Promise((resolve, reject) => {
         const sqlStatement = `INSERT INTO films(title, favorite, watchdate, rating, user)
                                  VALUES (?, ?, ?, ?, ?)`;

         const params = [newTitle, newFavorite, newWatchdate, newRating, newUser];

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
   update(newFilm) {
      const filmId = newFilm.id;
      const newTitle = newFilm.title;
      const newFavorite = newFilm.favorite;
      const newWatchdate = newFilm.watchdate;
      const newRating = newFilm.rating;
      const newUser = 1;  // * temporary arbitrary data *

      return new Promise((resolve, reject) => {
         const sqlStatement = `UPDATE films 
                               SET title=?, favorite=?, watchdate=?, rating=?, user=?
                               WHERE id=?`;

         const params = [newTitle, newFavorite, newWatchdate, newRating, newUser, filmId];

         this.#db.run(sqlStatement, params, function (err) {
            if (err)
               reject(err);
            else
               resolve(this.changes > 0);
         });
      });
   }

   deleteFilm(id) {
      return new Promise((resolve, reject) => {
         const sql = 'DELETE FROM films WHERE id=?';
         this.#db.run(sql, [id], function (err) {
            if (err) 
               reject(err);
            else 
               resolve(this.changes > 0);
         });

      });
   }

}

module.exports = FilmDAO.getFilmDAOInstance;