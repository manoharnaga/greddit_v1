import { useState,useEffect } from "react";
import { Link, Route,Routes } from "react-router-dom";
import Form1 from "./Form1";
import Home from './Home';
import Profile from "./Profile";

const App = () => {
  const [isLoggedin, setLogin] = useState(
    () => {
      const saved = localStorage.getItem("login-key");
      const initialValue = JSON.parse(saved);
      return initialValue || "";
    }
  );
  
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // storing input name
    localStorage.setItem("login-key", JSON.stringify(isLoggedin));
  }, [isLoggedin]);
  
  
  return (
      <div className="container">
        {/* <h1>localStorage with React hooks</h1> */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
          <Route exact path="/login" element={<Form1 Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
          <Route exact path="/profile" element={<Profile Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
        </Routes>
      </div>
  );
};

export default App;