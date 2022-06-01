import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Film } from '../../FilmLibrary'

function FilmForm(props) {
   const {
      film, setLoading, 
      setErrorMessage, editMode,
      editFilm, addFilm,
      setSuccessMessage , setFilm
   } = props;

   const defaultValues = {
      id: film ? film.id : '',
      title: film ? film.title : '',
      favorite: film ? film.favorite : false,
      watchdate: film ?
         (film.watchdate ? film.watchdate.format("YYYY-MM-DD") : '') : '',
      rating: film ? (film.rating ?? 0) : 0
   }

   const [id, setId] = useState(defaultValues['id']);
   const [title, setTitle] = useState(defaultValues['title']);
   const [favorite, setFavorite] = useState(defaultValues['favorite']);
   const [watchdate, setWatchdate] = useState(defaultValues['watchdate']);
   const [rating, setRating] = useState(defaultValues['rating']);
   const navigate = useNavigate();

   const handleSubmit = async (event) => {
      event.preventDefault();
      const newFilm = new Film(id, title, favorite, watchdate, rating);

      if(editMode)
         setFilm(newFilm);

      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
         if (editMode)  { /* edit mode */
            await editFilm(newFilm);
            setSuccessMessage(`The film "${title}" was successfully updated`)
         }
         else {           /* add mode */
            await addFilm(newFilm);
            setSuccessMessage(`The film "${title}" was successfully added`);
         }
      }
      catch(error) {
         setErrorMessage("Something went wrong with your request");
         setLoading(false);
         return;
      }

      navigate("/");
   }

   const handleReset = () => {
      setId(defaultValues['id']);
      setTitle(defaultValues['title']);
      setFavorite(defaultValues['favorite']);
      setWatchdate(defaultValues['watchdate']);
      setRating(defaultValues['rating']);
   }

   const handleCancel = () => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      navigate("/");
   }

   return (
      <>
         <Row className="mt-3">
            <Col></Col>
            <Col as="main" xs={9} sm={7} lg={6} xl={5} className='my-2 p-2'>
               <div style={{
                  borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted',
                  borderRadius: 10, padding: '0.5em 1.75em'
               }}>
                  <Form onSubmit={handleSubmit}>
                     {editMode && <Form.Group className='my-3'>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" value={id} disabled={true} required={true} />
                     </Form.Group>}

                     <Form.Group className='my-3'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} required={true} placeholder="Film Title"
                           onChange={event => { 
                              const newTitle = event.target.value;
                              setTitle(newTitle); 
                           }} />
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Favorite</Form.Label>
                        <Form.Check type="checkbox" className="form-check-inline ms-2" checked={favorite}
                           required={false} onChange={event => { 
                              const newFavorite = event.target.checked;
                              setFavorite(newFavorite);
                           }}></Form.Check>
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Watchdate</Form.Label>
                        <Form.Control type="date" value={watchdate}
                           onChange={event => { 
                              const newWatchdate = event.target.value;
                              setWatchdate(newWatchdate);
                           }} />
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" value={rating} required={false}
                           onChange={event => { 
                              const newRating = Number(event.target.value) ?? 0;
                              setRating(newRating);
                           }} min={0} max={5} />
                     </Form.Group>

                     <Form.Group className='my-4' align="right">
                        <Button variant='outline-danger' onClick={handleCancel} className="me-1 mt-2">Cancel</Button>
                        <Button variant='outline-warning' onClick={handleReset} className="mx-1 mt-2">Reset</Button>
                        <Button variant='outline-success' type="submit" className="ms-1 mt-2">Confirm</Button>
                     </Form.Group>
                  </Form>
               </div>
            </Col>
            <Col></Col>
         </Row>
      </>
   );
}

export default FilmForm