import dayjs from "dayjs";

function Film(id, title, favorite = false, watchdate, rating) {
   this.id = id;
   this.title = title;
   this.favorite = favorite;
   this.watchdate = watchdate ? dayjs(watchdate) : undefined;
   this.rating = rating;

   this.filter = function (filterName) {
      switch (filterName) {
         case "all":
            return true;
         case "favorite":
            return this.favorite;
         case "best-rated":
            return this.rating === 5;
         case "seen-last-month":
            return (this.watchdate !== undefined) && (dayjs().diff(this.watchdate, 'day') <= 30);
         case "unseen":
            return this.watchdate === undefined;
         default:
            return true;
      }
   };
}

function FilmLibrary() {
   this.films = [];

   this.addNewFilm = function (film) {
      this.films.push(film);
   }

   this.deleteFilm = (filmId) => {
      const indexToRemove = this.films.findIndex(film => film.id === filmId);

      if (indexToRemove >= 0)
         this.films.splice(indexToRemove, 1);
   };
}

function loadFilmLibrary() {
   let filmLibrary = new FilmLibrary();

   // fake data
   filmLibrary.addNewFilm(new Film("abc", "Pulp Fiction", true, "2022-04-10", 5));
   filmLibrary.addNewFilm(new Film("bcd", "21 Grams", true, "2022-04-17", 4));
   filmLibrary.addNewFilm(new Film("cde", "Star Wars", false));
   filmLibrary.addNewFilm(new Film("def", "Matrix"));
   filmLibrary.addNewFilm(new Film("efg", "Shrek", false, "2022-04-21", 3));

   filmLibrary.addNewFilm(new Film("fgh", "The Incredibles", true, "2022-03-28", 5));
   filmLibrary.addNewFilm(new Film("ghi", "Tolo Tolo", false, "2022-04-29", 4));
   filmLibrary.addNewFilm(new Film("hij", "Don Matteo", false, "", 2));
   filmLibrary.addNewFilm(new Film("ijk", "Spiderman", false, "2020-12-07", 5));
   filmLibrary.addNewFilm(new Film("jkl", "Il testimone invisibile", true, "2020-08-18"));

   return filmLibrary;
}

function loadFilters() {
   const filters = [
      "All",
      "Favorite",
      "Best rated",
      "Seen last month",
      "Unseen"
   ];

   return filters;
}

function loadFilmHeaders() {
   const filmHeaders = [
      "Title",
      "Favorite",
      "Date",
      "Rating",
   ];

   return filmHeaders;
}

export { Film, loadFilmLibrary, loadFilters, loadFilmHeaders };