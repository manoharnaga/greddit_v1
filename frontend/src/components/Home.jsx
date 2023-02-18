import Navbar from "./Navbar"
const Home = (props) => {
    return (
        <div>
            <Navbar Loginval={props.Loginval}
              Loginfunc={props.Loginfunc}
              userData={props.userData}
              setUserData={props.setUserData}/>
            <h1>Home</h1>
        </div>
    )
}

export default Home;