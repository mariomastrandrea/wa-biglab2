import { Container, Navbar, Form } from "react-bootstrap";
import { PersonCircle, PlayCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";


function FilmLibraryNavbar(props) {
   const navigate = useNavigate();

   return (
      <Navbar bg="primary" variant="dark" expand="md">
         <Container fluid>
            <Navbar.Toggle />

            <Navbar.Brand className="d-flex align-items-center">
               <PlayCircle onClick={() => navigate("/")} size="1.2em" className="me-1 action-icon" />
               <span>Film Library</span>
            </Navbar.Brand>

            <Navbar.Collapse className="flex-md-grow-0 mb-2 mt-3 my-md-0">
               {props.title !== undefined ?
                  <Navbar.Brand>{props.title}</Navbar.Brand> :
                  <Form.Control id="search-box" type="text" placeholder="Search..." />
               }
            </Navbar.Collapse>

            <PersonCircle color="white" size="1.6em" className="action-icon" />
         </Container>
      </Navbar>
   );
}

export default FilmLibraryNavbar