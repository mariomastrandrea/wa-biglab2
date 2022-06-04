import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Row } from "react-bootstrap"
import ErrorBox from "../components/ErrorBox";
import SpinnerBox from "../components/SpinnerBox";
import FilmForm from "../components/filmComponents/FilmForm";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import { useUpdateUser, useUser } from "../UserContext";
import { getCurrentSession } from "../API";

function NewFilmPage(props) {
   const user = useUser();
   const updateUser = useUpdateUser();
   const navigate = useNavigate();

   const {
      setLoading, loading,
      setErrorMessage, errorMessage,
      setSuccessMessage, addFilm
   } = props;

   useEffect(() => {
      if (!user) {
         getCurrentSession().then(user => {
            if (!user) {
               // user is not authenticated yet -> redirect to login page
               setLoading(false);
               navigate("/login");
               return;
            }

            updateUser(user);
            // user is logged in 
            setLoading(false);
         });
      }
      else setLoading(false);
      
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

         {loading && <SpinnerBox small={true} />}
         <FilmForm addFilm={addFilm} setLoading={setLoading}
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </>
   );
}

export default NewFilmPage;