import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { USERS_API_URL } from "../constants";
import { useAppContext } from "../context/AppContext";

const NewUserForm = (props) => {
  const initialData = { id: 0, name: "", email: "", document: "", phone: "", password:"" };
  const [formData, setFormData] = useState(initialData);
  const [errorMessage, setErrorMessage] = useState("");
  const { getUsers } = useAppContext();

  useEffect(() => {
    if (props.user) {
      const { id, name, email, document, phone } = props.user;
      setFormData({ id, name, email, document, phone });
    }
  }, [props.user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(USERS_API_URL, formData);
      if ((resp.statusText = "OK")) {        
        setFormData(initialData);
        props.toggle();
        getUsers();
          
      }
    } catch (err) {
        console.log(err);
        setErrorMessage(err.response.data.error);
    }
    };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.put(
        `${USERS_API_URL}/${props.user.name}`,
        formData
      );
      if ((resp.statusText = "OK")) {
        setFormData(initialData);
        props.toggle();
        getUsers();
      }
    } catch (err) {
        console.log(err);
        setErrorMessage(err.response.data.error)
    }
  };

  return (
    <Form onSubmit={props.user ? handleEditUser : handleAddUser}>
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  value={formData.name}
                  disabled={props.user ? true : false}
        />
      </FormGroup>
          {!props.user && <FormGroup>
            <Label for="password">Password:</Label>
            <Input
                type="password"
                name="password"
                required
                onChange={handleChange}
                value={formData.password}
            />
        </FormGroup>}
      <FormGroup>
        <Label for="email">Email:</Label>
        <Input
          type="email"
          name="email"
          required
          onChange={handleChange}
          value={formData.email}
        />
      </FormGroup>
      <FormGroup>
        <Label for="document">Document:</Label>
        <Input
          type="text"
          name="document"
          required
          onChange={handleChange}
          value={formData.document}
        />
      </FormGroup>
      <FormGroup>
        <Label for="phone">Phone:</Label>
        <Input
          type="number"
          name="phone"
          required
          onChange={handleChange}
          value={formData.phone}
        />
      </FormGroup>

      <Button>Send</Button>

             
    <div className="text-center">
        <img
            alt="logo"
            src="../../images/emoji-smile-fill.svg"
            style={{ width: "30px", height: "30px" }}
        />
    </div>

    <div>
              <p>{errorMessage}</p>
    </div>

    </Form>
  );
};
export default NewUserForm;
