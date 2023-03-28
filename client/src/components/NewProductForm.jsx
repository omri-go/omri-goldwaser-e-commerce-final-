import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { PRODUCTS_API_URL, SUBMIT_REVIEW } from "../constants";
import { useAppContext } from "../context/AppContext";

const NewProductForm = (props) => {
    const initialData = { id: 0, name: "", category: "", description: "", price: 0 };
    const [formData, setFormData] = useState(initialData);
    const { isAuthenticated,getProducts } = useAppContext();

    useEffect(() => {
        if (props.product) {
            const { id, name, category, description, price } = props.product;
            setFormData({ id, name, category, description, price });
        }
    }, [props.product]);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post(PRODUCTS_API_URL, formData);
            if ((resp.statusText = "OK")) {
                setFormData(initialData);
                props.toggle();
                getProducts();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Form onSubmit={handleAddProduct}>
            <FormGroup>
                <Label for="name">Name:</Label>
                <Input
                    type="text"
                    name="name"
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
            </FormGroup>
            <FormGroup>
                <Label for="category">Category:</Label>
                <Input type="select" name="category" required onChange={handleChange} value={formData.category} >
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
                />
            </FormGroup>
            <Button>Send</Button>
        </Form>
    );
};
export default NewProductForm;
