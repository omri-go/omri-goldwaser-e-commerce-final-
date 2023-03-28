import { useState } from "react";
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap";
import axios from "axios";
import { USERS_API_URL, PRODUCTS_API_URL, CHECKOUT } from "../constants";
import { useAppContext } from "../context/AppContext";

const ConfirmCheckout = (props) => {
  const [isModal, setIsModal] = useState(false);
    const { getUsers, getProducts, productsInCart, setproductsInCart } = useAppContext();

  const toggle = () => setIsModal((prev) => !prev);
  
  function getHeaderWithToken(){
    const token = localStorage.getItem('auth_token');      
    let data = {};      
    if (typeof token === "string"){        
      data["token"] = token;
    }
    
    const headers = { 'Authorization': `Token ${token}` };          
    return headers;
  }  

  const handleCheckout = async () => {
    try {
      let headers = getHeaderWithToken();
      headers = { ...headers, 'products_to_buy': productsInCart };
      const resp = await axios.post(CHECKOUT + "2", { headers });
      // prev version of checkout
      //const resp = await axios.post(`${REMOVE_PRODUCT_FROM_CART}/${product.id}`, data);
      //console.log(headers);
      //const resp = await axios.get(CHECKOUT, {headers});
      if ((resp.statusText = "OK")) {
        toggle();
        getProducts();
        setproductsInCart([])
      }
    } catch (err) {
      console.log(err);
    }    
  };  



  return (
    <>
      <Button color="danger" onClick={() => toggle()}>
        Checkout
      </Button>
      <Modal isOpen={isModal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Do you really want to pay?
        </ModalHeader>
        <ModalFooter>
          <Button type="button" onClick={() => toggle()}>
            Cancel
          </Button>
          <Button
            type="button"
            color="primary"
            onClick={() => handleCheckout()}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default ConfirmCheckout;
