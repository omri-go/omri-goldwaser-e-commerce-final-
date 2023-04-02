import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import NewUserModal from "./NewUserModal";
import Login from "./Login";
import Logout from "./Logout";


const Header = () => {
    const { loggedUserData, isAuthenticated, productsInCart } = useAppContext();  

  return (
      <React.Fragment>
          <header className="p-3 border-bottom bg-light">
              <div className="container-fluid">
                  <div className="row g-3">
                      <div className="col-md-3 text-center">
                          <Link to="/">
                              <img
                                  alt="logo"
                                  src="../../images/logo.png"
                              />
                          </Link>
                      </div>
                      
                      <div className="col-md-4">

                          <Link to="/" className="btn btn-success">
                              <img
                                  alt="products"
                                  src="../../images/cart3.svg"
                              />
                              <span className="ms-2 fw-bold text-white">Catalogue</span>
                          </Link>
                          {isAuthenticated && 
                          <div className="position-relative d-inline me-3">
                              <Link to="/cart" className="btn btn-primary">
                                  
                                  <img
                                      alt="cart"
                                      src="../../images/cart-check.svg"
                                  />
                                  <div className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-circle"> {/*TODO change number based on number of items in cart*/}
                                      {productsInCart.length}
                                  </div>
                                  <span className="ms-2 fw-bold text-white">Cart</span>
                              </Link>
                          </div>
                          }

                          <Link to="/contact" className="btn btn-info">
                              <img
                                  alt="contact"
                                  src="../../images/info-circle-fill.svg"
                              />
                              <span className="ms-2 fw-bold text-white">Contact</span>
                          </Link>

                          <Link to="/about" className="btn btn-warning">
                              <img
                                  alt="about us"
                                  src="../../images/bell-fill.svg"
                              />
                              <span className="ms-2 fw-bold text-white">About us</span>
                          </Link>

                          <Link to="/chatbot" className="btn btn-secondary">
                              <img
                                  alt="chatbot"
                                  src="../../images/bell-fill.svg"
                              />
                              <span className="ms-2 fw-bold text-white">Chatbot</span>
                          </Link>

                      </div>
                      <div className="col-md-5 text-end">
                          {!isAuthenticated && <NewUserModal create={true} />}
                          {!isAuthenticated && <Login isAuthenticated={isAuthenticated} />}
                          {isAuthenticated && <Link to="/profile" className="btn btn-danger">
                              <img
                                  alt="profile page"
                                  src="../../images/person-badge-fill.svg"
                              />
                              <span className="ms-2 fw-bold text-white">{loggedUserData.username}</span>
                          </Link>}
                          {isAuthenticated && <Logout isAuthenticated={isAuthenticated} />}                          
                      </div>
                  </div>
              </div>
          </header>
      </React.Fragment>
  );
};
export default Header;
