import { Navigate } from "react-router-dom";

const Home = (props) => {
    if(props.Loginval === "false"){
        // localStorage.setItem("username", JSON.stringify("none"));
        // localStorage.setItem("password", JSON.stringify("none"));
        return <Navigate to="/login" />;
    }
    return (
        <div>
            <h1>Home</h1>
            <input type="submit" className="btn btn-lg btn-secondary" onClick={
                (event) => {
                    event.preventDefault();
                    props.Loginfunc("false");
                }
            } 
            value="Log out"></input>
        </div>
        
    );
}

export default Home;