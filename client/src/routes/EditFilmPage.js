import { Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import FilmForm from "../components/filmComponents/FilmForm";

function EditFilmPage(props) {
   const { filmId } = useParams();
   const film = props.films.find(film => film.id === filmId); 

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar title="Edit film" />
         </Row>

         {!film ?
            <ErrorBox message="ERROR: please search a correct film ID" /> : 
            <FilmForm editFilm={props.editFilm} film={film} />
         }
      </>
   );
}

export default EditFilmPage;