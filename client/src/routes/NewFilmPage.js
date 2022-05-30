import { useEffect } from "react";
import { Row } from "react-bootstrap"
import ErrorBox from "../components/ErrorBox";
import FilmForm from "../components/filmComponents/FilmForm";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import SpinnerBox from "../components/SpinnerBox";

function NewFilmPage(props) {
   const { 
      setLoading, loading, 
      setErrorMessage, errorMessage, 
      setSuccessMessage, addFilm
   } = props;

   useEffect(() => {
      setLoading(false);
      // eslint-disable-next-line
   }, []);

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar title="Add new film" setLoading={setLoading} 
               setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
         </Row>

         { // if there was a connection error -> show the error message
            errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
      
         {loading && <SpinnerBox small={true} /> }
         <FilmForm addFilm={addFilm} setLoading={setLoading} 
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </>
   );
}

export default NewFilmPage;