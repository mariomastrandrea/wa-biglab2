import { Container, Navbar, Form,Button } from "react-bootstrap";
import { PersonCircle, PlayCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../../API";
import { useUser, useUpdateUser } from "../../UserContext";

function FilmLibraryNavbar(props) {
   const { title, setLoading, setErrorMessage, setSuccessMessage, activeFilter } = props;
   const navigate = useNavigate();
   const user = useUser(); 
   const updateUser = useUpdateUser();

   function goToHome() {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      navigate("/");
   }

   function goToLogin() {
      //setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      navigate("/login");
   }

   async function handleLogout() {
      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);
      
      //setTimeout(async () => {   // to simulate a long request (1s)
         try {
            await logout();
            updateUser(undefined);  // delete user info from context
            setSuccessMessage("You have successfully logged out");
            setTimeout(() => setSuccessMessage(""), 3000);  // make success message disappear after 4s
            navigate("/login");
         }
         catch(err){
            setErrorMessage("Something went wrong with your request")
            setLoading(false);
         }
      //}, 1000);      
   }

   return (
      <Navbar bg="primary" variant="dark" expand="md">
         <Container fluid>
            <Navbar.Toggle />

            <Navbar.Brand className="d-flex align-items-center">
               <PlayCircle onClick={activeFilter === 'all' ? () => undefined : () => goToHome()} 
                  size="1.2em" className="me-1 action-icon" />
               <span>Film Library</span>
            </Navbar.Brand>

            <Navbar.Collapse className="flex-md-grow-0 mb-2 mt-3 my-md-0">
               {title !== undefined ?
                  <Navbar.Brand>{title}</Navbar.Brand> :
                  <Form.Control id="search-box" type="text" placeholder="Search..." />
               }
            </Navbar.Collapse>
            
            <Navbar.Brand>
               <Button onClick={() => user ? handleLogout() : goToLogin()}>{user ? "Logout" : "SignIn"}</Button>
               <PersonCircle color="white" size="1.6em" className="action-icon" />
            </Navbar.Brand>
         </Container>
      </Navbar>
   );
}

export default FilmLibraryNavbar;