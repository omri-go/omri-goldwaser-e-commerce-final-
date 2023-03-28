import { useState } from "react";
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap";
import axios from "axios";
import { USERS_API_URL, PRODUCTS_API_URL } from "../constants";
import { useAppContext } from "../context/AppContext";

const ConfirmRemovalModal = (props) => {
  const [isModal, setIsModal] = useState(false);
  const { getUsers, getProducts } = useAppContext();

  const toggle = () => setIsModal((prev) => !prev);

  const handleDeleteUser = async (name) => {
    try {
      const resp = await axios.delete(`${USERS_API_URL}/${name}`);
      if ((resp.statusText = "OK")) {
        toggle();
        getUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const resp = await axios.delete(`${PRODUCTS_API_URL}/${productId}`);
      if ((resp.statusText = "OK")) {
        toggle();
        getProducts();
      }
    } catch (err) {
      console.log(err);
    }
  };  

  return (
    <>
      <Button color="danger" onClick={() => toggle()}>
        Remove
      </Button>
      <Modal isOpen={isModal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
                  {props.is_product ? "Do you really want to delete the product?" : "Do you really want to delete the user?"}
        </ModalHeader>
        <ModalFooter>
          <Button type="button" onClick={() => toggle()}>
            Cancel
          </Button>
          <Button
            type="button"
            color="primary"
            onClick={() => props.is_product ? handleDeleteProduct(props.productId) : handleDeleteUser(props.userName)}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default ConfirmRemovalModal;
