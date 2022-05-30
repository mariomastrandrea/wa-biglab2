import { Container, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { revertFromSnakeCase } from "../utilities.js"
import FiltersBox from '../components/FiltersBox';
import AddButton from '../components/AddButton';
import ErrorBox from '../components/ErrorBox';
import FilmTable from '../components/filmComponents/FilmTable';
import FilmLibraryNavbar from '../components/filmComponents/FilmLibraryNavbar.js';
import SpinnerBox from '../components/SpinnerBox.js';
import SuccessBox from '../components/SuccessBox.js';


function Home(props) {
   const param = useParams();

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

      getFilmsFilteredBy(activeFilter).then(() => setLoading(false)).catch(() => {
         setErrorMessage("An error occurred retrieving films from the server");
         setLoading(false);
      });

      // eslint-disable-next-line
   }, [activeFilter]);

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
               setSuccessMessage={setSuccessMessage} />
         </Row>
         {pageContent}
      </>
   );
}

export default Home;