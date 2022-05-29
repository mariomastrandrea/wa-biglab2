import { Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import FilmForm from "../components/filmComponents/FilmForm";
import { useEffect, useState } from "react";
import SpinnerBox from "../components/SpinnerBox";

function EditFilmPage(props) {
   const filmId = Number(useParams().filmId);
   const [film, setFilm] = useState(null);
   const { loading, errorMessage, getFilm, setLoading, setErrorMessage } = props;

   useEffect(() => {
      getFilm(filmId).then(film => {
         setFilm(film);
         setLoading(false);
      })
         .catch(() => {
            setErrorMessage("Cannot load the requested film")
            setLoading(false);
         });
      // eslint-disable-next-line
   }, []);

   const headerContent =
      <Row as="header">
         <FilmLibraryNavbar title="Edit film" setLoading={setLoading} setErrorMessage={setErrorMessage} />
      </Row>

   if (loading && !film) { // if the page is loading -> display only the spinner
      return <>
         {headerContent}
         <SpinnerBox />
      </>;
   }

   if (loading && film) {  // the update is in progress
      return <>
         {headerContent}
         <SpinnerBox small={true} />
         <FilmForm editMode={true} editFilm={props.editFilm} film={film}
            setLoading={setLoading} setErrorMessage={setErrorMessage} loading={loading} />
      </>;
   }

   if (errorMessage && !film)  // if there was a connection error retrieving the film -> show the error message only
      return <>
         {headerContent}
         <ErrorBox message={errorMessage} />
      </>;

   if (errorMessage && film) // if there was an error during the film update -> show the error message and keep the film data
      return <>
         {headerContent}
         <ErrorBox message={errorMessage} />
         <FilmForm editMode={true} editFilm={props.editFilm} film={film}
            setLoading={setLoading} setErrorMessage={setErrorMessage} />
      </>;

   // * there isn't any error here *

   if (!film) // film not found 
      return <>
         {headerContent}
         <ErrorBox message="ERROR: please search for a correct film ID" />
      </>;

   // all ok
   return (
      <>
         {headerContent}
         <FilmForm editMode={true} editFilm={props.editFilm} film={film}
            setLoading={setLoading} setErrorMessage={setErrorMessage} />
      </>
   );
}

export default EditFilmPage;