import { useAppContext } from "../context/AppContext";
import ListProducts from "./ListProducts";
import ConfirmCheckout from "./ConfirmCheckoutModal";

const Cart = () => {
    const { isAuthenticated, productsInCart, isSuperUser } = useAppContext();

    return (
        <div>
            <br></br>
            <h1>Cart</h1>
            <br></br>        
        { isAuthenticated && <div>            
            <ListProducts products={productsInCart} isCart={true} />            
            {!isSuperUser && <ConfirmCheckout />}
            </div>}
        </div>
    );
};
export default Cart;
