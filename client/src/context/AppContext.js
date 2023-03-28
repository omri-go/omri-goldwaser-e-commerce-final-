import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { USERS_API_URL, PRODUCTS_API_URL, API_URL, GET_PRODUCTS_BY_CATEGORY } from "../constants";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [users, setUsers] = useState();
  const [products, setProducts] = useState(); // these are the products shown to the user
  const [storedProducts, setStoredProducts] = useState(); // these are all the products, the user doesn't see them
  const [loggedUserData, setLoggedUserData] = useState({});
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [productsInCart, setproductsInCart] = useState([]);
  const [messages, setMessages] = useState([]);
  
  function getHeaderWithToken(){
    const token = localStorage.getItem('auth_token');      
    let data = {};      
    if (typeof token === "string"){        
      data["token"] = token;
    }
    
    const headers = { 'Authorization': `Token ${token}` };          
    return headers;
  }

  const getUsers = async () => {
    try {
      let headers = getHeaderWithToken()   

      const resp = await axios.get(USERS_API_URL, {headers});
      setUsers(resp.data);      
    } catch (err) {
      console.log(err);
    }
  };

  const updateLoginStatus = async () => {
    // check if a user is logged in, and if so update user data  
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };

    if (localStorage.getItem("auth_token")){
      await axios.get(`${API_URL}/api/get_user_data`, { headers })
      .then(response => {        
          // handle the response data here        
          setLoggedUserData(response.data);
          if (response.data["is_superuser"] == true) {              
              setIsSuperUser(true);
          }        
          setisAuthenticated(true);
      })
      .catch(error => {
          console.log(error);
          setisAuthenticated(false);
          setIsSuperUser(false);
      });   
    }
    else{
        setLoggedUserData({});
        setisAuthenticated(false);   
        setIsSuperUser(false);
    }
    
  };  

  const getProducts = async () => {
    try {
      let headers = getHeaderWithToken() 
      const resp = await axios.get(GET_PRODUCTS_BY_CATEGORY + '/all/all', { headers });
      setStoredProducts(resp.data);
      setProducts(resp.data);   

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateLoginStatus();
    getUsers();    
    getProducts();    
  }, []);

  return (
      <AppContext.Provider value={{ users, products, loggedUserData, isAuthenticated, getUsers, 
      getProducts, setLoggedUserData, productsInCart, setproductsInCart, storedProducts, setProducts, isSuperUser, setMessages, messages }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
