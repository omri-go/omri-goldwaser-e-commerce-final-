import { useState, useEffect } from "react";
import { Button} from "reactstrap";
import { useAppContext } from "../context/AppContext";

const Logout = (props) => {
  const { updateLoginStatus} = useAppContext();
  
  const {isAuthenticated} = props;
  const [show_button, setShowButton] = useState(isAuthenticated || (localStorage.getItem('auth_token')));

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('auth_token');
    window.location.href = '';
  };  

  // TODO fix this
  useEffect(() => {
    const token = !!(localStorage.getItem('auth_token'));
    if (token){
      setShowButton(true);
    }
    else{
      setShowButton(false);
    }    
  }, [isAuthenticated]);   

  return (
    <>
      { show_button &&
        <span>     
          {<Button 
              className="float-right"
              color="primary"
              onClick={handleLogout}
              style={{ minWidth: "200px" }}
            >
              Logout
            </Button>
          }
        </span>
      }      
    </>
  );
};
export default Logout;
