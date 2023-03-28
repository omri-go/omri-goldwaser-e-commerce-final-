import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { PRODUCTS_API_URL, SUBMIT_REVIEW } from "../constants";
import { useAppContext } from "../context/AppContext";

const EditProductForm = (props) => {
  const initialData = { id: 0, name: "", category: "", description: "", price: 0 };
  const [formData, setFormData] = useState(initialData);
  const { getProducts, isAuthenticated, isSuperUser } = useAppContext();  

  useEffect(() => {
    if (props.product) {
      const { id, name, category, description, price } = props.product;
      setFormData({ id, name, category, description, price });      
    }
  }, [props.product]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditProduct = async (e) => {
    e.preventDefault();      
    const token = localStorage.getItem('auth_token');
    formData["token"] = token;
             
    try {
      const resp = await axios.put(
        `${PRODUCTS_API_URL}/${props.product.id}`,
        formData
      );
      if ((resp.statusText = "OK")) {
        setFormData(initialData);
        props.toggle();
        getProducts();
      }
    } catch (err) {
      console.log(err);
    }
  };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        formData["token"] = token;

        try {
            const resp = await axios.put(
                `${SUBMIT_REVIEW}/${props.product.id}`,
                formData
            );
            if ((resp.statusText = "OK")) {
                setFormData(initialData);
                props.toggle();
                getProducts();
            }
        } catch (err) {
            console.log(err);
        }
    };

    function getReviewsRender() {             
        let revs = props.product.reviews;
        let output = null;
        if (revs.length > 0) {
            output = (
                <div>
                    {revs.map((rev) => (
                        <p key={rev.id}>{rev.reviewer}: {rev.review}</p>
                    ))}
                </div>
            );
        } else {
            output = <p>No reviews submitted.</p>;
        }    
        return output;
    }

    return (
    <div>
    <Form onSubmit={handleEditProduct}>
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input
          type="text"
          name="name"
          required
          onChange={handleChange}
          value={formData.name}
          disabled={!isAuthenticated || !isSuperUser}
        />
      </FormGroup>
      <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Label for="category" style={{ marginRight: '5px' }}>
                    Category:
                </Label>
                {/*render emoji*/}
                {formData.category === 'book' && (
                    <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                        &#x1F4D6;
                    </div>
                )}
                        {formData.category === 'car' && (
                    <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                                &#x1F697;
                    </div>
                )}
                {formData.category === 'lamp' && (
                    <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                                &#x1F4A1;
                    </div>
                )}

            </div>

        <Input type="select" name="category" required onChange={handleChange} value={formData.category} disabled={!isAuthenticated || !isSuperUser} >          
          <option value="book">Book</option>
          <option value="car">Car</option>
          <option value="lamp">Lamp</option>          
        </Input>        
      </FormGroup>
      <FormGroup>
        <Label for="description">Description:</Label>
        <Input
          type="text"
          name="description"          
          onChange={handleChange}
          value={formData.description}
          disabled={!isAuthenticated || !isSuperUser}
        />
      </FormGroup>
      <FormGroup>
        <Label for="price">Price:</Label>
        <Input
          type="number"
          name="price"
          min="0"
          required
          onChange={handleChange}
          value={formData.price}
          disabled={!isAuthenticated || !isSuperUser}
        />
      </FormGroup>
          {isAuthenticated && isSuperUser && <Button>Send</Button>}          
            </Form>

            <br></br>            
            {isAuthenticated && props.product.status == "Bought" &&
                <Form onSubmit={handleSubmitReview}>
                    <FormGroup>
                        <Label for="review">Add your review:</Label>
                        <Input
                            type="text"
                            name="review"
                            onChange={handleChange}
                            value={formData.review}
                            disabled={!isAuthenticated}
                        />
                    </FormGroup>
                    {isAuthenticated && <Button>Send</Button>}
                </Form>
            }
            <h2>Reviews:</h2>     
            <p>{props.create}</p>

            <div>
                {getReviewsRender()}
            </div>
    
    </div>
  );
};
export default EditProductForm;
