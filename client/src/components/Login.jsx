import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import LoginForm from "./LoginForm";

import { useAppContext } from "../context/AppContext";

const Login = (props) => {
  const [isModal, setIsModal] = useState(false);  

  const toggle = () => setIsModal((prev) => !prev);
 
  return (
    <> 
        <span>          
              <Button 
              className="float-right"
              color="primary"
              onClick={toggle}
              style={{ minWidth: "200px" }}
            >
              Login 
            </Button>
        </span>
      <Modal isOpen={isModal} toggle={toggle}>
        <ModalHeader toggle={toggle}>           
          {"Login"}
        </ModalHeader>
        <ModalBody>
          <LoginForm user={props.user} toggle={toggle} />
        </ModalBody>
      </Modal>
    </>
  );
};
export default Login;
