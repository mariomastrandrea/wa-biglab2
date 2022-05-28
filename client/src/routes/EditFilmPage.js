import { Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import FilmForm from "../components/filmComponents/FilmForm";

function EditFilmPage(props) {
   const filmId = Number(useParams().filmId);
   const film = props.getFilm(filmId);
   const loading = props.loading;

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar title="Edit film" />
         </Row>

         {loading ?
            <Row className="p-5 mt-5 d-flex justify-content-center">
               <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
               </Spinner>
            </Row> :

            (!film ?
               <ErrorBox message="ERROR: please search a correct film ID" /> :
               <FilmForm editFilm={props.editFilm} film={film} />
            )
         }
      </>
   );
}

export default EditFilmPage;