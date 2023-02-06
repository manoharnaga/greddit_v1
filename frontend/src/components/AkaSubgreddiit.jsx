import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';

const AkaSubGreddit = (props) => {

  const [AkaSubGreddits,setAkaSubGreddits] = useState();
  
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    // function to be called on page load/refresh
    const SubgredditObj = () => {
      console.log("Page loaded/refreshed");
      fetch(`http://localhost:7000/akasubgreddits/dataall`, {
        method: "GET",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "AKAsubgredditUsers sent") {
            const AkaSubgreddits = data.AkaSubgreddits;
            setAkaSubGreddits(AkaSubgreddits);
          } else {
            console.log(
              "Unable to fetch AkaSubgreddit Data! - AkaSubgreddit.jsx"
            );
          }
        })
        .catch((error) => console.error("Error:", error));
    };
    if (JSON.parse(localStorage.getItem("login-key")) === "true") {
      SubgredditObj();
    }
  }, [location.pathname]);

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const OpenSubGreddit  = (_id) => {
    console.log("Akasubgreddit in New Page!",_id);
    localStorage.setItem('akasubgredditId', _id);
    navigate(`/akasubgreddits/${_id}`,{state:{id:_id}});
  };

  const card = (name,description,postlength,joinedlength,_id) => {
    return (
    <React.Fragment>
      <CardContent>
        <Typography variant="h4" component="div">
          {name}
        </Typography>
        <Typography variant="body1">
        {description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="no. of posts">
          <PostAddIcon color="primary"/>
          <Typography variant="body2">
            {postlength}
          </Typography>
        </IconButton>
        <IconButton aria-label="no. of people">
          <PeopleIcon color="primary"/>
          <Typography variant="subtitle2">
          {joinedlength}
          </Typography>
        </IconButton>
        {/* <Button size="small" onClick={() => LeaveSubGreddit(_id)}>LEAVE</Button> */}
        <Button size="small" onClick={() => OpenSubGreddit(_id)}>OPEN</Button>
      </CardActions>
    </React.Fragment>
    );
  };
  
  return (
  <div>
    <h1>Helo AkaSubGreddit</h1>
    
    {AkaSubGreddits?.map((subgreddit,index) => (
      subgreddit.joined.includes(props.userData.username) ?
          <Box key={index} sx={{ minWidth: 275}}>
            <Card variant="outlined">{card(subgreddit.name,subgreddit.description,subgreddit.post.length,subgreddit.joined.length,subgreddit._id)}</Card>
          </Box> : null
    ))}

    {AkaSubGreddits?.map((subgreddit,index) => (
      !subgreddit.joined.includes(props.userData.username) ?
          <Box key={index} sx={{ minWidth: 275}}>
            <Card variant="outlined">{card(subgreddit.name,subgreddit.description,subgreddit.post.length,subgreddit.joined.length,subgreddit._id)}</Card>
          </Box> : null
    ))}
  </div>
  );
}

export default AkaSubGreddit;
