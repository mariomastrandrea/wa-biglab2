import { Container, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { revertFromSnakeCase } from "../utilities"
import FiltersBox from '../components/FiltersBox';
import AddButton from '../components/AddButton';
import ErrorBox from '../components/ErrorBox';
import FilmTable from '../components/filmComponents/FilmTable';
import FilmLibraryNavbar from '../components/filmComponents/FilmLibraryNavbar';
import SpinnerBox from '../components/SpinnerBox';
import SuccessBox from '../components/SuccessBox';
import { useUser, useUpdateUser } from '../UserContext';
import { getCurrentSession } from '../API';


function Home(props) {
   const param = useParams();
   const user = useUser();
   const updateUser = useUpdateUser();
   const navigate = useNavigate();

   const {
      loading, setLoading,
      errorMessage, setErrorMessage,
      filters, headers,
      getFilmsFilteredBy,
      films, deleteFilm,
      setFilmRating, setFilmFavorite,
      successMessage, setSuccessMessage
   } = props;

   const activeFilter = props.activeFilter || param.activeFilter?.toLowerCase();

   useEffect(() => {
      setLoading(true);

      if(!user) {
         getCurrentSession().then(user => {
            if(!user) {
               // user is not authenticated yet -> redirect to login page
               setLoading(false);
               navigate("/login");
               return;
            }

            updateUser(user);
            // user is logged in -> retrieve his films
            getFilmsFilteredBy(activeFilter).then(() => {
               setLoading(false);
            })
            .catch(() => {
               setErrorMessage("An error occurred retrieving films from the server");
               setLoading(false);
            });
         });
      }
      else {   // user is logged in -> retrieve his films
         getFilmsFilteredBy(activeFilter).then(() => {
            setLoading(false);
         })
         .catch(() => {
            setErrorMessage("An error occurred retrieving films from the server");
            setLoading(false);
         });
      }
      
      // eslint-disable-next-line
   }, [activeFilter]);

   if(!user) {
      return <></>;
   }

   let pageContent;

   // check if the specified filter exist, otherwise return a blank page
   if (!filters.some(filter => filter === revertFromSnakeCase(activeFilter)))
      pageContent = <ErrorBox>{"Error: please specify an existing filter"}</ErrorBox>;
   else
      pageContent =
         <Row className='h-100'>
            {/* sidebar */}
            <Col as="aside" className="bg-light col-3 p-4 h-100">
               <FiltersBox className="h-100" filters={filters} active={activeFilter} 
                  setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
            </Col>

            {/* main content */}
            <Col className="col-9">
               <Container fluid>
                  <Row className="p-3 pt-4">
                     <h1>{revertFromSnakeCase(activeFilter)}</h1>
                  </Row>

                  {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
                  {successMessage && <SuccessBox>{successMessage}</SuccessBox>}

                  {activeFilter === 'all' && !loading && films && films.length === 0 && 
                     <SuccessBox>
                        {`Welcome to your film library! Add your first film clicking the '+' button below`}
                     </SuccessBox>}

                  {(loading && films.length > 0) ? <SpinnerBox small={true} /> : <></>}
                  <Row as="main" className="px-4">
                     <FilmTable setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating} loading={loading}
                        deleteFilm={deleteFilm} headers={headers} films={films} activeFilter={activeFilter} 
                        setLoading={setLoading} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
                  </Row>
                  {(loading && films.length === 0) ? <SpinnerBox small={true} /> : <></>}

                  <Row className="m-1">
                     <AddButton>+</AddButton>
                  </Row>
               </Container>
            </Col>
         </Row>;

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar setLoading={setLoading} setErrorMessage={setErrorMessage} 
               setSuccessMessage={setSuccessMessage} activeFilter={activeFilter} />
         </Row>
         {pageContent}
      </>
   );
}

export default Home;