import { useState } from "react";
import { Navigate } from "react-router-dom";

const Form1 = (props) => {
  const [newUser, setUser] = useState(0);
  const [inpError, setError] = useState(0);
  const [LoginDisabled, setLoginDisabled] = useState(1);
  const [RegisterDisabled, setRegisterDisabled] = useState(1);

  const [loginData, setLogindata] = useState({
    username: "",
    password: ""
  });

  const [RegisterData, setRegisterData] = useState({
    fname: "",
    lname: "",
    username: "",
    emailid: "",
    age: "",
    phno: "",
    password: "",
    followers: [
      { id: 1, username: 'abc' },
      { id: 2, username: 'abc1' },
      { id: 3, username: 'abc2' },
      { id: 4, username: 'abc3' }, 
    ],
    following: [
      { id: 1, username: 'abc' },
      { id: 2, username: 'abc1' },
      { id: 3, username: 'abc2' },
      { id: 4, username: 'abc3' },
    ]
  });

  if(props.Loginval === "true"){      // already logged in!
    console.log("Home"+inpError);
    return <Navigate to="/" />;
  }

  // Register functions
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...RegisterData,
      [e.target.name]: e.target.value
    });

    let checkRegister = 1;
    for(const key in RegisterData){
      if(key !== e.target.name){
        checkRegister = checkRegister && (RegisterData[key].length > 0);
        // console.log(RegisterData[key]);
      }
    }
    // console.log(checkRegister,e.target.value);
    setRegisterDisabled(!(checkRegister && (e.target.value.length > 0)));
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if(RegisterDisabled === 1) return;
    setUser(0);       // correct input
    await fetch(`http://localhost:5000/auth/register`, {
      method: 'POST',
      crossDomain: true,
      body: JSON.stringify(RegisterData),
      headers: {
        'Content-Type': 'application/json',
        Accept:"application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }

  // Login functions
  const handleLoginChange = (e) => {
    setLogindata({
      ...loginData,
      [e.target.name]: e.target.value
    })

    let checkLogin = true;
    for(const key in loginData){
      if(key !== e.target.name){
        checkLogin = checkLogin && (loginData[key].length > 0);
      }
      // console.log(key,loginData[key],loginData[key].length,checkLogin);
    }
    // console.log(check,e.target.value);
    setLoginDisabled(!(checkLogin && (e.target.value.length > 0)));
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    if(LoginDisabled === 1) return;
    
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
      
      console.log('loginForm1',data);
      if(data.status === "Login successful!"){
        const userdata = data.user;
        localStorage.setItem("username", JSON.stringify(loginData.username));
        localStorage.setItem("password", JSON.stringify(loginData.password));
        props.setUserData(userdata);
        setError(0);
        props.Loginfunc("true");
      }
      else{
        setError(1);
      }
      setLogindata({username:"",password:""});
    })
    .catch(error => console.error('Error:', error));
  }

  
  return (
    (newUser) ? 
    <form onSubmit={handleRegister}>
        <input onChange={handleRegisterChange} value={RegisterData.fname}type="text" name="fname" placeholder="First Name" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.lname} type="text" name="lname" placeholder="Last Name" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.username} type="text" name="username" placeholder="User Name" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.emailid} type="email" name="emailid" placeholder="Email Id" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.age} type="number" name="age" placeholder="Age" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.phno} type="tel" name="phno" placeholder="Phone Number" className="form-control" />
        <input onChange={handleRegisterChange} value={RegisterData.password} type="password" name="password" placeholder="Password" className="form-control" />
        <button type="submit" className="btn btn-lg btn-primary" disabled={RegisterDisabled}>
        Register
        </button>
        <button type="submit" className="btn btn-lg btn-primary" onClick={
        (e) => {
          e.preventDefault();
          setError(0);
          setUser(0);
          setRegisterData({fname: "",lname: "",username: "",emailid: "",age: "",phno: "",password: ""});
        }
      } 
      >Login</button>
    </form>
    :
    <form onSubmit={handleLogin}>
      {(inpError) ? <p style={{color:"red"}}>Invalid Username/Password!!</p>:null}
      <input
        type="text"
        value={loginData.username}
        onChange={handleLoginChange}
        placeholder="username"
        name="username"
        className="form-control"
      />
      <input
        type="password"
        value={loginData.password}
        onChange={handleLoginChange}
        placeholder="Password"
        name="password"
        className="form-control"
      />
      <button type="submit" className="btn btn-lg btn-primary" disabled={LoginDisabled}>Login</button>
      <button type="submit" className="btn btn-lg btn-primary" onClick={
        (e) => {
          e.preventDefault();
          setError(0);
          setUser(1);
          setLogindata({username:"",password:""});
        }
      } 
      >Register</button>
    </form>
  );
};

export default Form1;