import { Container, Navbar, Form,Button } from "react-bootstrap";
import { PersonCircle, PlayCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../../API";
import { useContext } from "react";
import UserContext from "../../UserContext";


function FilmLibraryNavbar(props) {
   const { title, setLoading, setErrorMessage, setSuccessMessage } = props;
   const navigate = useNavigate();
   const user = useContext(UserContext);  // TODO: useContext...

   function goToHome() {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      navigate("/");
   }

   function handleLogin() {
      navigate("/login");
   }

   async function handleLogout() {

      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);
      
      try {
         await logout();
         navigate("/login");
      }
      catch(err){
         setLoading(false);
         setErrorMessage("Something went wrong with your request")
      }
   }

   return (
      <Navbar bg="primary" variant="dark" expand="md">
         <Container fluid>
            <Navbar.Toggle />

            <Navbar.Brand className="d-flex align-items-center">
               <PlayCircle onClick={() => goToHome()} size="1.2em" className="me-1 action-icon" />
               <span>Film Library</span>
            </Navbar.Brand>

            <Navbar.Collapse className="flex-md-grow-0 mb-2 mt-3 my-md-0">
               {title !== undefined ?
                  <Navbar.Brand>{title}</Navbar.Brand> :
                  <Form.Control id="search-box" type="text" placeholder="Search..." />
               }
            </Navbar.Collapse>
            
            <Navbar.Brand>
               <PersonCircle color="white" size="1.6em" className="action-icon" />
               <Button onClick={() => user  ? handleLogout() : handleLogin()}>{user ? "Logout" : "SignIn"}</Button>
            </Navbar.Brand>


         </Container>
      </Navbar>
   );
}

export default FilmLibraryNavbar