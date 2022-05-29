import { Row, Spinner } from "react-bootstrap";

function SpinnerBox(props) {
   const { small } = props;

   return (
      <Row className={`${small ? "pb-3" : "p-5"} mt-5 d-flex justify-content-center`}>
         <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
         </Spinner>
      </Row>
   );
}

export default SpinnerBox;