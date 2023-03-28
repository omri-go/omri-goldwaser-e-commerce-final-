import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { LOGIN_URL } from "../constants";

const LoginForm = (props) => {
  const initialData = { name: "", password: ""};
  const [formData, setFormData] = useState(initialData);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (props.user) {
  //     const { id, name, email, document, phone } = props.user;
  //     setFormData({ id, name, email, document, phone });
  //   }
  // }, [props.user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(LOGIN_URL, formData);
      if ((resp.statusText = "OK")) {
        setFormData(initialData);
        props.toggle();

        const token = resp.data.token;
        localStorage.setItem('auth_token', token);
        window.location.href = '';        
      }
    } catch (err) {
      console.log(err);
        setErrorMessage(err.response.data.error);
    }
  };  

  return (
    <Form onSubmit={handleLogin}>
      <FormGroup>
        <Label for="username">Username:</Label>
        <Input
          type="text"
          name="username"
          required
          onChange={handleChange}
          value={formData.username}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password:</Label>
        <Input
          type="password"
          name="password"
          required
          onChange={handleChange}
          value={formData.password}
        />
      </FormGroup>
      <Button>Send</Button>
          <div>
              <p>{errorMessage}</p>
          </div>
    </Form>
  );
};
export default LoginForm;
