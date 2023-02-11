import { Navigate } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdbIcon from '@mui/icons-material/Adb';
import { Button } from "@mui/material";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CollectionsIcon from '@mui/icons-material/Collections';

const Home = (props) => {

  if(props.Loginval === "false"){
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">
          <AdbIcon color="primary"/>
          <Button>Greddiit</Button>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto">
            <li className="navbar-item">
              <a className="nav-link" aria-current="page" href="/">
                <Button>
                <HomeIcon color="primary"/>
                  HOME
                </Button>
              </a>
            </li>
            <li className="navbar-item">
              <a className="nav-link" aria-current="page" href="/profile">
                <Button>
                <PersonIcon color="primary"/>
                PROFILE
                </Button>
              </a>
            </li>
            <li className="navbar-item">
              <a className="nav-link" aria-current="page" href="/mysubgreddits">
                <Button>
                <InsertPhotoIcon color="primary"/>
                My Subgreddits
                </Button>
              </a>
            </li>
            <li className="navbar-item">
              <a className="nav-link" aria-current="page" href="/akasubgreddits">
                <Button>
                <CollectionsIcon color="primary"/>
                Aka Subgreddits
                </Button>
              </a>
            </li>
            <li className="navbar-item">
              <a className="nav-link" aria-current="page" href="#logout">
                <Button
                  type="submit"
                  // color="grey"
                  onClick={(event) => {
                    event.preventDefault();
                    props.Loginfunc("false");
                  }}
                >
                <LogoutIcon color="action"/>
                Log out
                </Button>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;



// <div>
//             <h1>Home</h1>
//             <input type="submit" className="btn btn-lg btn-secondary" onClick={
//                 (event) => {
//                     event.preventDefault();
//                     props.Loginfunc("false");
//                 }
//             } 
//             value="Log out"></input>
//         </div>