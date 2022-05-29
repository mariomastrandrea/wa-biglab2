import { Row, Col, Alert } from 'react-bootstrap';

function ErrorBox(props) {
   return (
      <Row className='mt-4 mx-5'>
         <Col>
            <Alert key='danger' variant='danger'>{props.message}</Alert>
         </Col>
      </Row>
   );
}

export default ErrorBox;