import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import NewProductForm from "./NewProductForm";
import EditProductForm from "./EditProductForm";
import { useAppContext } from "../context/AppContext";

const NewProductModal = (props) => {
  const [isModal, setIsModal] = useState(false);
  const { isAuthenticated, isSuperUser } = useAppContext(); 

  const toggle = () => setIsModal((prev) => !prev);

  return (
    <>
      {props.create ? (
        <Button
          className="float-right"
          color="primary"
          onClick={toggle}
          style={{ minWidth: "200px" }}
        >
          Add product
        </Button>
      ) : (
        <Button onClick={toggle}>View Product</Button>
      )}
        {props.create ? (
            <Modal isOpen={isModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Create Product
                </ModalHeader>
                <ModalBody>
                    <NewProductForm product={props.product} toggle={toggle} />
                </ModalBody>
            </Modal>
        ) : (
            <Modal isOpen={isModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                          {isAuthenticated && isSuperUser && (
                              <div>Edit Product</div>
                          )}
                          {!isSuperUser && (
                              <div>View Product</div>
                          )}
                </ModalHeader>
                <ModalBody>
                    <EditProductForm product={props.product} toggle={toggle} />
                </ModalBody>
            </Modal>
        )}

    </>
  );
};
export default NewProductModal;
