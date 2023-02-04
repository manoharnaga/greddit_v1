import { useState,useEffect } from "react";
import { useLocation,Link, Route,Routes } from "react-router-dom";
import Form1 from "./Form1";
import Home from './Home';
import Profile from "./Profile";
import MySubGreddits from "./MySubgreddits";
import SubGredditMod from "./SubgredditMod";


const App = () => {
  const [isLoggedin, setLogin] = useState(
    () => {
      const initialValue = JSON.parse(localStorage.getItem("login-key"));
      return initialValue || "";
    }
  );
  const [userData, setUserData] = useState(0);

  useEffect(() => {
    // storing input name
    localStorage.setItem("login-key", JSON.stringify(isLoggedin));
  }, [isLoggedin]);
  
  
  let location = useLocation();
  useEffect(() => {
    // function to be called on page load/refresh
    const loginDatafunc = () => {
      const usernameSaved = JSON.parse(localStorage.getItem("username"));
      const passwordSaved = JSON.parse(localStorage.getItem("password"));
      return {username:usernameSaved || "",password: passwordSaved || ""};
    }
    let loginData = loginDatafunc();
    const userObj = async () => {
      console.log('Page loaded/refreshed');
      console.log("logindata from localStorage",loginData);
      await fetch(`http://localhost:5000/auth/login`, {
        method: 'POST',
        crossDomain: true,
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
          Accept:"application/json",
          "Access-Control-Allow-Origin": "*",
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
  
        if(data.status === "Login successful!"){
          const userdata = data.user;
          setUserData(userdata);
        }
        else{
          console.log("Unable to fetch User Data! - App.jsx");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    if(JSON.parse(localStorage.getItem("login-key")) === "true"){
      userObj();
    }
  }, [location.pathname]);




  return (
      <div className="container">
        {/* <h1>localStorage with React hooks</h1> */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {/* <li><Link to="/editprofile">EditProfile</Link></li> */}
            <li><Link to="/mysubgreddits">My Sub Greddiits</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
          <Route exact path="/login" element={<Form1 Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
          <Route exact path="/profile" element={<Profile Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData}/>} /> 
          <Route exact path="/mysubgreddits" element={<MySubGreddits Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
          <Route path="/mysubgreddits/:id" element={<SubGredditMod/>} /> 
        </Routes>
      </div>
  );
};

export default App;