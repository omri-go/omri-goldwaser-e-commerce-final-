
import { Container, Row, Col } from "reactstrap";
import { useAppContext } from "../context/AppContext";
import ListProducts from "./ListProducts";
import NewProductModal from "./NewProductModal";

const Home = () => {
    const { products, isAuthenticated, isSuperuser } = useAppContext();  
  

  return (
    <div>
    <Container style={{ marginTop: "20px" }}>      
      <h1>Store</h1>
      <br></br>
      <Row>
        <Col>
            <ListProducts products={products} isCart={false} />
        </Col>
      </Row>
      <Row>
        <Col>
            {isAuthenticated && isSuperuser && <NewProductModal create={true} />}
        </Col>
      </Row>  

      <br></br>   
      <p>user: admin    password:1234</p>
      <p>user: food_book24   password:1234</p>      
      </Container>      
      </div>
         
  );
};

export default Home;
