import { useState } from 'react';
import { Form } from 'react-bootstrap'
import { PencilSquare, Trash, Star, StarFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';


function FilmRows(props) {
   let library = props.films;

   return (
      library.map((film) =>
         <FilmRow editFilm={props.editFilm} setFilmRating={props.setFilmRating}
            deleteFilm={props.deleteFilm} film={film} key={`film-${film.id}`} setLoading={props.setLoading} />)
   );
}

function FilmRow(props) {
   const film = props.film;
   const filmTitleClass = `${film.favorite ? "favorite-" : ""}film-title`;
   const navigate = useNavigate();
   const setLoading = props.setLoading;

   function navigateToEditFilm(id) {
      setLoading(true); 
      navigate(`/editFilm/${id}`);
   }

   return (
      <tr>
         <td key="film-title">
            <PencilSquare onClick={() => navigateToEditFilm(film.id)}
               className="me-1 action-icon" size="0.95em" />
            <Trash onClick={() => props.deleteFilm(film.id)}
               className="me-3 action-icon" size="0.95em" />
            <span className={filmTitleClass}>{film.title}</span>
         </td>
         <td key="film-favorite">
            <Form.Check onChange={async (event) => {
               event.target.disabled=true;
               await props.editFilm({...film, favorite: event.target.checked});
               event.target.disabled=false;
            }}
               type="checkbox" label="Favorite" checked={film.favorite} className="action-icon-wrapper" />
         </td>
         <td key="film-watchdate">{film.watchdate?.format("MMMM D, YYYY")}</td>
         <td key="film-rating">
            <Rating setFilmRating={props.setFilmRating} film={film} />
         </td>
      </tr>
   );
}

function Rating(props) {
   const rating = (props.film.rating >= 0 && props.film.rating <= 5) ? props.film.rating : 0;
   const [hoverRating, setHoverRating] = useState(rating);
   let stars = [];

   for (let i = 0; i < 5; i++) {
      stars.push(i < hoverRating ?
         <StarFill color={rating === hoverRating ? "current-color" : "#0d6efd"}
            onMouseOut={() => setHoverRating(rating)} onMouseOver={() => setHoverRating(i + 1)}
            onClick={() => props.setFilmRating(props.film.id, i + 1)}
            key={`${i + 1}-star`} className="action-icon" /> :
         <Star onMouseOut={() => setHoverRating(rating)} onMouseOver={() => setHoverRating(i + 1)}
            onClick={() => props.setFilmRating(props.film.id, i + 1)}
            key={`${i + 1}-star`} className="action-icon" />
      );
   }

   return stars;
}

export default FilmRows
