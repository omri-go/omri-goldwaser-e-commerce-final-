import "./App.css";
import AppProvider from "./context/AppContext";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import ContactPage from "./components/ContactPage";
import ProfilePage from "./components/ProfilePage";
import Cart from "./components/Cart";
import Chatbot from "./components/Chatbot";


function App() {
  return (
      <BrowserRouter>
          <AppProvider>
              <Header />
              <div className="App">
                  <Routes>              
                      <Route exact path="/about" element={<AboutUs />} />
                      <Route exact path="/contact" element={<ContactPage />} />
                      <Route exact path="/profile" element={<ProfilePage />} />
                      <Route exact path="/cart" element={<Cart />} />
                      <Route exact path="/chatbot" element={<Chatbot />} />
                      <Route exact path="/" element={<Home />} />
                  </Routes>                  
              </div>                   
          </AppProvider>
      </BrowserRouter>
  );
}

export default App;
