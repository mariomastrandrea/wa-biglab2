const db = require("./Database");
const Film = require("../models/Film");
const dayjs = require("dayjs");
let instance;

class FilmDAO {
    #db;

    constructor() {
        this.db = db;
    }

    static getFilmDAOInstance() {
        if(!instance) {
            instance = new FilmDAO();
        }
        return instance;
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM films", (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.map(row =>
                    new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
            });
        });
    }

    getFilm(id) {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM films WHERE id=?", [id], (err, rows) => {
                if(err) {
                    reject(err);
                }
                resolve(rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating))[0]);
            })
        });
    }

    getFilmByFilter(filter) {
        let sql;
        let args = new Array();
        switch(filter) {
            case "all":
                sql="SELECT * FROM films";
                break;
            case "favorite":
                sql="SELECT * FROM films WHERE favorite=1";
                break;
            case "best-rated":
                sql="SELECT * FROM films WHERE rating=5";
                break;
            case "unseen":
                sql="SELECT * FROM films WHERE watchdate=null";
                break;
            case "seen-last-month":
                sql="SELECT * FROM films";
            default:
                sql="SELECT * FROM films";
                break;
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, args, (err, rows) => {
                if(err) {
                    return reject(err);
                }

                //a very dirty workaround because the date is stored in the DB as text
                if(filter === "seen-last-month")
                    return resolve(rows.filter(
                        row => dayjs().diff(dayjs(row.watchdate), 'day') <= 30
                    ).map(
                        row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)
                        ));
                return resolve(rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
            });
        });
    }

    //TODO: implement functions below
}

module.exports = FilmDAO.getFilmDAOInstance;