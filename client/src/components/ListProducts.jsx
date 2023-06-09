import { Table, Container, Input, Button } from "reactstrap";
import NewProductModal from "./NewProductModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Alert } from 'reactstrap';

const ListProducts = ({ products, isCart }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { getProducts, productsInCart, setproductsInCart, isAuthenticated, storedProducts, setProducts, isSuperUser } = useAppContext(); 
  const [showAlert, setShowAlert] = useState(false);


    function handleSelectedCategory() {
        return function (event) {
            setSelectedCategory(event.target.value);
            updateShownProducts(event.target.value, selectedStatus);
        };
    }

    function handleSelectedStatus() {
        return function (event) {
            setSelectedStatus(event.target.value);
            updateShownProducts(selectedCategory, event.target.value);
        };
    }

    function updateShownProducts(chosen_category, chosen_status) {
        let updated_products = [];
        storedProducts.forEach((item) => {            
            if ((chosen_category == 'all' || item.category == chosen_category) && (chosen_status == 'all' || item.status == chosen_status || 
                (chosen_status == "None" && item.status =='') )) {
                updated_products.push(item);
            }
        });
        setProducts(updated_products);
    }

    function CustomAlert(props) {
        return (
            <div>
                <Alert color="primary">
                    {props.alert_text}
                </Alert>
            </div>
        );
    };

    const addProductToCart = async (product) => {
        
    try {
      const token = localStorage.getItem('auth_token');
      const data = {
        token: token,
      };
      let i;
      for (i in productsInCart) {
          if (productsInCart[i].id == product.id) {              
              setShowAlert(true);
              return;
          }
      }

      // add product to cart state
      setproductsInCart(prevCartProducts => [...prevCartProducts, product]);

      // not used anymore
    //const resp = await axios.post(`${ADD_PRODUCT_TO_CART}/${product.id}`, data);
    //if ((resp.statusText = "OK")) {
    //    //toggle();        
    //    getProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const removeProductFromCart = async (product) => {
    try {
      const token = localStorage.getItem('auth_token');
      const data = {
        token: token,
      };    
      // remove product from cart state
      const updatedProductsInCart = productsInCart.filter(p => p.id !== product.id);
      setproductsInCart(updatedProductsInCart);      

      // not used anymore
      //const resp = await axios.post(`${REMOVE_PRODUCT_FROM_CART}/${product.id}`, data);
      //if ((resp.statusText = "OK")) {
      //  //toggle();        
      //  getProducts();
      //}
    } catch (err) {
      console.log(err);
    }
  };  

  function getCartButtonText(product_status) {
    if (product_status=='In Cart') {
      return "Remove from cart";
    } else {
      return "Add to cart";
    }
  }
  function getCartButtonFunction(product_status, product_id, product) {

    if (product_status=='In Cart') {       
      return removeProductFromCart(product);
    } else {
      return addProductToCart(product);
    }
  }  

  return (
    <Container>    
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category
                {!isCart && <Input type="select" name="category" required value={selectedCategory} onChange={handleSelectedCategory()} >
                    <option value="all">All</option>
                    <option value="book">Book</option>
                    <option value="car">Car</option>
                    <option value="lamp">Lamp</option>
                </Input>}
            </th>
            <th>Description</th>
            <th>Price</th>
            <th>Status
            {!isCart && <Input type="select" name="category" required value={selectedStatus} onChange={handleSelectedStatus()} >  
                <option value="all">All</option>        
                <option value="None">None</option>
                <option value="In Cart">In cart</option>
                <option value="Bought">Bought</option>          
              </Input>}
            </th>                  
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!products || products.length <= 0 ? (
            <tr>
              <td colSpan="6" align="center">
                              {!isCart && <b>No products in the database. Create one.</b>}
                              {isCart && <b>Cart is empty.</b>}
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                    <td>{product.status}</td>

                    

                    {/*this handles the buttons of the regular products menu */}
                    {!isCart && <td align="center">
                        {/*view product details button*/}
                        <NewProductModal product={product} /> 
                        &nbsp;&nbsp;
                        {/* add / remove product from cart button*/}
                        {isAuthenticated && !isSuperUser && product.status != 'Bought' && 
                             <Button
                                className="float-right"
                                color="primary"
                                onClick={() => { getCartButtonFunction(product.status, product.id, product) }}
                                style={{ minWidth: "100px" }}
                            >
                                {getCartButtonText(product.status)}
                            </Button>
                        }
                        
                        &nbsp;&nbsp;
                        {/*remove product button*/}
                        {isAuthenticated && isSuperUser && <ConfirmRemovalModal productId={product.id} is_product={true} product_name={product.name} />} 
                    </td>
                    }

                    {/*this handles the buttons of the cart menu*/}
                    {isCart && isAuthenticated && !isSuperUser && <td align="center">
                        <Button
                            className="float-right"
                            color="primary"
                            onClick={() => { getCartButtonFunction('In Cart', product.id, product) }}
                            style={{ minWidth: "100px" }}
                        >
                            Remove from cart
                        </Button>
                    </td>
                    }
              </tr>
            ))
          )}
        </tbody>
          </Table>
          {/*{showAlert && <CustomAlert alert_text={"The product is already in the cart"} />}*/}
    </Container>

  );
};
export default ListProducts;
