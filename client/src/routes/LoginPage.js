import { Row, Col, Form,Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import ErrorBox from "../components/ErrorBox";
import { login } from "../API";

function LoginPage(props) {
   const { 
      setLoading, 
      setErrorMessage, 
      setSuccessMessage,
      errorMessage
   } = props;
   
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   function validateEmail(email) {
      return /^.+@.+\..+$/.test(email);
   }

   async function handleSubmit(event) { 
      event.preventDefault();

      setErrorMessage("");
      setSuccessMessage("");

      // validate email format
      if(!validateEmail(email)) {
         setErrorMessage("You must insert a proper email (example@domain.com)");
         return;
      }

      setLoading(true);

      try {
         const user = await login({
            username: email,
            password: password
         });

         setSuccessMessage(`Benvenuto ${user.name} <3`);
      }
      catch(error) {
         setErrorMessage(error);
         setLoading(false);
         return;
      }

      navigate("/");
   }

   const headerContent =
      <Row as="header">
         <FilmLibraryNavbar title="Login" setLoading={setLoading} 
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </Row>

   const formContent = 
      <Row className="mt-3">
         <Col></Col>
         <Col as="main" xs={8} sm={6} lg={5} xl={4} className='my-2 p-1'>
            <div style={{
               borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted',
               borderRadius: 10, padding: '0.5em 1.75em'
            }}>
               <Form onSubmit={handleSubmit}>
                     <Form.Group className='my-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} required={true} placeholder={"email"}
                              onChange={event => setEmail(event.target.value)} />
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} required={true} placeholder={"password"}
                              onChange={event => setPassword(event.target.value)} />
                     </Form.Group>

                     <Form.Group className='my-4' align="center">
                        <Button variant='outline-success' type="submit" className="mt-1">Login</Button>
                     </Form.Group>
               </Form>
            </div>
         </Col>
         <Col></Col>
      </Row>;

   return (
      <>
         {headerContent}
         {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
         {formContent}
      </>
   );
}

export default LoginPage;