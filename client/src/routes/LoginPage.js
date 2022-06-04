import { Row, Col, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import SuccessBox from "../components/SuccessBox";
import SpinnerBox from "../components/SpinnerBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import { login, getCurrentSession } from "../API";
import { useUpdateUser, useUser } from "../UserContext";


function LoginPage(props) {
   const {
      loading,
      setLoading,
      setErrorMessage,
      setSuccessMessage,
      errorMessage,
      successMessage
   } = props;

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const user = useUser();
   const updateUser = useUpdateUser();

   useEffect(() => {
      if (!user) {
         getCurrentSession().then(user => {
            if (!user) {
               setLoading(false);
               return;
            }

            // user is already authenticated -> redirect to home page
            navigate("/");
         });
      }
      else  // user is already authenticated -> redirect to home page
         navigate("/");

      // eslint-disable-next-line
   }, []);

   function validateEmail(email) {
      return /^.+@.+\..+$/.test(email);
   }

   async function handleSubmit(event) {
      event.preventDefault();

      setErrorMessage("");
      setSuccessMessage("");

      // validate email format
      if (!validateEmail(email)) {
         setErrorMessage("You must insert a proper email (example@domain.com)");
         return;
      }

      setLoading(true);


      //setTimeout(async () => {   // simulate a long request (1s)
         try {
            const user = await login({
               username: email,
               password: password
            });

            updateUser(user); // update user context
            console.clear();
            setSuccessMessage(`Benvenuto ${user.name}!`);
            navigate("/");
         }
         catch (err) {
            setErrorMessage("Incorrect username or password. Try again");
            setLoading(false);
            return;
         }
      //}, 1000);
   }

   const headerContent =
      <Row as="header">
         <FilmLibraryNavbar title="Login" setLoading={setLoading}
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </Row>

   const formContent =
      <Row className="mt-3">
         <Col></Col>
         <Col as="main" xs={8} sm={6} lg={5} xl={4} className='my-2 p-1 login-form'>
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
         {successMessage && <SuccessBox>{successMessage}</SuccessBox>}
         {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
         {loading && <SpinnerBox small={true} />}
         {formContent}
      </>
   );
}

export default LoginPage;