import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AkaSubGreddit = (props) => {

  const [AkaSubGreddits,setAkaSubGreddits] = useState();
  const [SortObj, setSortObj] = useState({isSorted: false});
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchAkaSubGreddits,setSearchAkaSubGreddits] = useState();

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


  // const searchBarFunc = () => {
  //   const filteredData = AkaSubGreddits.filter((subgreddit) =>
  //     subgreddit.name.toLowerCase().includes(searchBarValue.toLowerCase())
  //   )
  // };

  // useEffect(() => {
  //   if(searchBarValue === 0){
  //     searchBarFunc();
  //   }
  // }, [searchBarValue]);

 
  

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const OpenSubGreddit  = (_id) => {
    console.log("Akasubgreddit in New Page!",_id);
    localStorage.setItem('akasubgredditId', _id);
    navigate(`/akasubgreddits/${_id}`,{state:{id:_id}});
  };

  const joinOrLeaveSubGreddit = (subgredditId,isJoinOrLeave) => {
    console.log('joinreq');
    fetch(`http://localhost:7000/akasubgreddits/joinreq`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify({id: subgredditId,userId: props.userData.username,isJoinOrLeave: isJoinOrLeave}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.status === "Join/Leave Request sent Successfully!"){
          console.log("join/leave request akasubgreddit - Successfull!",data);
          const AkaSubgreddits = data.AkaSubgreddits;
          setAkaSubGreddits(AkaSubgreddits);
        }
        else if(data.status === "Already left Subgreddit before!"){
          alert("Why the hell you left Our Subgreddit before!");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  const handleSearchBarChange = (e) => {
    setSearchBarValue(e.target.value);
  }


  const card = (moderator,name,description,postlength,joinedlength,_id,isJoined) => {
    return (
    <React.Fragment>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
            M
          </Avatar>
        }
        action={
            isJoined ?
            <Button size="small" disabled>
              JOINED
            </Button>
            :
            <Button size="small" onClick={() => {
              joinOrLeaveSubGreddit(_id,1);
            }} >
              JOIN
            </Button> 
        }
        title={moderator}
        subheader="September 14, 2016"
      />
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
        {isJoined ? 
        <Button size="small" onClick={() => joinOrLeaveSubGreddit(_id,2)} disabled={(moderator===props.userData.username)}>LEAVE</Button>
        : null }
        <Button size="small" onClick={() => OpenSubGreddit(_id)}>OPEN</Button>
      </CardActions>
    </React.Fragment>
    );
  };
  
  return (
  <div>
    <h1>Helo AkaSubGreddit</h1>
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={searchBarValue}
        onChange={handleSearchBarChange}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
    <h2>Sort By</h2>


    <Button onClick={() => {
      const data = AkaSubGreddits.sort((suba,subb) => (suba.name > subb.name) ? 1 : -1);
      setAkaSubGreddits(data);
      setSortObj({
        isSorted: true
      })
    }}
    >Name : Ascending</Button>

    <Button onClick={() => {
      const data = AkaSubGreddits?.sort((suba,subb) => (suba?.name < subb?.name) ? 1 : -1);
      setAkaSubGreddits(data);
      setSortObj({
        isSorted: true
      })
    }}
    >Name : Descending</Button>

    <Button onClick={() => {
      const data = AkaSubGreddits?.sort((suba,subb) => (suba?.joined?.length < subb?.joined?.length) ? 1 : -1);
      setAkaSubGreddits(data);
      setSortObj({
        isSorted: true
      })
    }}
    // Descending
    >Followers</Button>

    <Button onClick={() => {
      const data = AkaSubGreddits?.sort((suba,subb) => (suba?.createdAt > subb?.createdAt) ? 1 : -1);
      setAkaSubGreddits(data);
      setSortObj({
        isSorted: true
      })
    }}
    // newest first
    >Creation Date</Button>

    <Button onClick={() => {
      setSortObj({
        isSorted: false
      })
    }}
    >Remove Sort</Button>
    {
      SortObj?.isSorted ?
      AkaSubGreddits?.map((subgreddit,index) => (
        <Box key={index} sx={{ minWidth: 275}}>
          <Card variant="outlined">{card(subgreddit.moderator,subgreddit.name,subgreddit.description,subgreddit.post.length,subgreddit.joined.length,
            subgreddit._id,subgreddit?.joined?.includes(props.userData.username))}</Card>
        </Box>
      )) : null
    }

    {
      !(SortObj?.isSorted) ?
      AkaSubGreddits?.map((subgreddit,index) => (
        subgreddit?.joined?.includes(props.userData.username) ?
            <Box key={index} sx={{ minWidth: 275}}>
              <Card variant="outlined">{card(subgreddit.moderator,subgreddit.name,subgreddit.description,subgreddit.post.length,subgreddit.joined.length,subgreddit._id,true)}</Card>
            </Box> : null
      )) : null
    }
    {
      !(SortObj?.isSorted) ?
      AkaSubGreddits?.map((subgreddit,index) => (
        !subgreddit?.joined?.includes(props.userData.username) ?
            <Box key={index} sx={{ minWidth: 275}}>
              <Card variant="outlined">{card(subgreddit.moderator,subgreddit.name,subgreddit.description,subgreddit.post.length,subgreddit.joined.length,subgreddit._id,false)}</Card>
            </Box> : null
      )): null
    }
  </div>
  );
}

export default AkaSubGreddit;
