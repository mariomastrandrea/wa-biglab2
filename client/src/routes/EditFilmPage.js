import { Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import FilmForm from "../components/filmComponents/FilmForm";
import { useEffect, useState } from "react";

function EditFilmPage(props) {
   const filmId = Number(useParams().filmId);
   const [film, setFilm] = useState({});
   const { loading, errorMessage, getFilm, setLoading } = props;

   useEffect(() => {
      getFilm(filmId).then(film => {
         setFilm(film);
         setLoading(false);
      });
   }, []);

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar title="Edit film" />
         </Row>

         {loading ?  // if the page is loading -> display only the spinner
            <Row className="p-5 mt-5 d-flex justify-content-center">
               <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
               </Spinner>
            </Row> :

            (errorMessage ?   // if there was a connection error -> show the error message only
               <ErrorBox message={errorMessage} /> :
               (film ?    
                  // after the page is loaded, without any error, display the film form if the film exist, an error otherwise
                  <FilmForm editFilm={props.editFilm} film={film} /> :
                  <ErrorBox message="ERROR: please search a correct film ID" />
               )
            )
         }
      </>
   );
}

export default EditFilmPage;