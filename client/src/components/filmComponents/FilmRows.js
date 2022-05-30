import { useState } from 'react';
import { Form } from 'react-bootstrap'
import { PencilSquare, Trash, Star, StarFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';


function FilmRows(props) {
   let library = props.films;

   const { 
      setFilmFavorite, setFilmRating, 
      deleteFilm, setLoading, 
      setErrorMessage, setSuccessMessage,
      activeFilter, loading
   } = props;

   return (
      library.map((film) =>
         <FilmRow setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating} activeFilter={activeFilter}
            deleteFilm={deleteFilm} film={film} key={`film-${film.id}`} setLoading={setLoading} loading={loading}
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />)
   );
}

function FilmRow(props) {
   const { film, setLoading, deleteFilm, setFilmFavorite, loading,
      setFilmRating, setErrorMessage, setSuccessMessage, activeFilter } = props;

   const filmTitleClass = `${film.favorite ? "favorite-" : ""}film-title`;
   const navigate = useNavigate();
   const [deleting, setDeleting] = useState(false);
   const [updating, setUpdating] = useState(false);


   function navigateToEditFilm(id) {
      setLoading(true);
      navigate(`/editFilm/${id}`);
   }

   async function handleSetFilmFavorite(id, target) {
      const favorite = target.checked;

      target.disabled = true;
      setUpdating(true);
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try { 
         await setFilmFavorite(id, favorite, activeFilter);
         setSuccessMessage(`"${film.title}" is now marked as ${favorite ? "" : "not "}favorite`);
      }
      catch(err) {
         setErrorMessage("An error occurred processing your request");
         setLoading(false);
      }

      setUpdating(false);
      target.disabled = false;
   }

   async function handleDeleteFilm(id) {
      setLoading(true);
      setDeleting(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
         await deleteFilm(id, activeFilter);
         setSuccessMessage(`The film "${film.title}" was successfully deleted`);
      }
      catch(err) {
         setErrorMessage("An error occurred processing your request");
         setLoading(false);
         setDeleting(false);
      }
   }

   return (
      <tr className={`${deleting ? "deleting" : ""} ${updating ? "updating" : ""}`}>
         <td key="film-title">
            <PencilSquare onClick={() => navigateToEditFilm(film.id)}
               className="me-1 action-icon" size="0.95em" />
            <Trash onClick={() => handleDeleteFilm(film.id)}
               className="me-3 action-icon" size="0.95em" />
            <span className={filmTitleClass}>{film.title}</span>
         </td>
         <td key="film-favorite">
            <Form.Check onChange={event => handleSetFilmFavorite(film.id, event.target)}
               type="checkbox" label="Favorite" checked={film.favorite} className="action-icon-wrapper" />
         </td>
         <td key="film-watchdate">{film.watchdate?.format("MMMM D, YYYY")}</td>
         <td key="film-rating">
            <Rating setFilmRating={setFilmRating} setLoading={setLoading} activeFilter={activeFilter} film={film}
               setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} 
               disabled={loading} setUpdating={setUpdating}/>
         </td>
      </tr>
   );
}

function Rating(props) {
   const { 
      setFilmRating, film, 
      activeFilter, setLoading, 
      setErrorMessage, setSuccessMessage,
      disabled, setUpdating
   } = props;

   const rating = (film.rating >= 0 && film.rating <= 5) ? film.rating : 0;
   const [hoverRating, setHoverRating] = useState(rating);
   let stars = [];

   async function handleSetFilmRating(film, newRating) {
      if(film.rating === newRating) return;

      setLoading(true);
      setUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      try { 
         await setFilmRating(film, newRating, activeFilter);
         setSuccessMessage(`"${film.title}" has now a rating of ${newRating}`);
      }
      catch(err) {
         setErrorMessage("An error occurred processing your request");
         setLoading(false);
      }

      setUpdating(false);
   }

   for (let i = 0; i < 5; i++) {
      stars.push(i < hoverRating ?
         <StarFill color={rating === hoverRating ? "current-color" : "#0d6efd"}
            onMouseOut={disabled ? (() => undefined) : (() => setHoverRating(rating))} 
            onMouseOver={disabled ? (() => undefined) : (() => setHoverRating(i + 1))}
            onClick={disabled ? (() => undefined) : (() => handleSetFilmRating(film, i + 1))}
            key={`${i + 1}-star`} className="action-icon" /> :
         <Star onMouseOut={disabled ? (() => undefined) : (() => setHoverRating(rating))} 
            onMouseOver={disabled ? (() => undefined) : (() => setHoverRating(i + 1))}
            onClick={disabled ? (() => undefined) : (() => handleSetFilmRating(film, i + 1))}
            key={`${i + 1}-star`} className="action-icon" />
      );
   }

   return stars;
}

export default FilmRows
