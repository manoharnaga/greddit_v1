import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

const SavedPost = (props) => {
  const [AkaSubGreddits,setAkaSubGreddits] = useState();

  const [CommentDisabled, setCommentDisabled] = useState(true);
  const [Comment, setComment] = useState('');
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

  const handlePostCommentChange = (e) => {
    setComment(e.target.value);
    setCommentDisabled(!(e.target.value.length > 0));
  };

  const addFollow = async (username,followerUsername) => {

    await fetch(`http://localhost:7000/akasubgreddits/follow`, {
    method: 'PUT',
    crossDomain: true,
    body: JSON.stringify({username:username,followerUsername:followerUsername}),
    headers: {
        'Content-Type': 'application/json',
        Accept:"application/json",
        "Access-Control-Allow-Origin": "*",
    }
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "both recieved - from AkaSubGreddit"){
          console.log("both recieved - from AkaSubGreddit",data);
          const userdata = data.firstResponse;
          props.setUserData(userdata);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  const handleUpdatePost = (UpdatePost) => {
    if (CommentDisabled && UpdatePost.comment!=="-1") return;
    console.log("UpdatePost");

    fetch(`http://localhost:7000/akasubgreddits/updatepost`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify(UpdatePost),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("post reached server!",data);
        if(data.status === "Post Updated Successfully!"){
          const AkaSubgreddits = data.AkaSubgreddits;
          setAkaSubGreddits(AkaSubgreddits);
        }
      })
      .catch((error) => console.error("Error:", error));
  };


  const handleRemoveSavedPost = async (SavedPost) => {
    await fetch(`http://localhost:7000/savedpost/remove`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify(SavedPost),
      headers: {
        'Content-Type': 'application/json',
        Accept:"application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(res => res.json())
    .then((data) => {
      console.log("savedpost reached server!",data);
      if(data.status === "Removed Saved Post Successfully!"){
        const AkaSubgreddits = data.AkaSubgreddits;
        setAkaSubGreddits(AkaSubgreddits);
      }
    })
    .catch(error => console.error('Error:', error));
  };
  const card = (subid,id,subname,postedBy,Text,upvotes,downvotes,comments) => {
    // id ==> postid && card ===> post
    return (
      <React.Fragment>
        <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
            M
          </Avatar>
        }
        action={
            props.userData.following.includes(postedBy) ?
            <Button size="small" disabled>
              FOLLOWING
            </Button>
            :
            <Button size="small" onClick={() => {
              addFollow(postedBy,props.userData.username);
            }}>
              FOLLOW
            </Button> 
            
        }
        title={subname+"\t\t::\t\t"+postedBy}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body1">
          {Text}
        </Typography>
        <Link href="#" underline="none">
          Comments
        </Link>
        <TextField id="standard-basic" label="Standard" variant="standard" name="comment" 
        onChange={handlePostCommentChange}/>
        <Button disabled={CommentDisabled} onClick={() =>{
          let voteUserId = props.userData.username;
          let UpdatePost = {
            id:subid,
            postid: id,
            upvotesid: "-1",
            downvotesid: "-1",
            comment: {
              comment: Comment,
              userId: voteUserId
            }
          }

          handleUpdatePost(UpdatePost);

        }
        }>SAVE</Button>
        <Button onClick={() => {
          setComment('');
          setCommentDisabled(false);
        }}>CANCEL</Button>

        {comments?.map((comment,index) => (
          //  {comment.userId} : 
          <Typography key={index} variant="body2">
           {comment}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => {
          let UpdatePost = {
            id:subid,
            postid: id,
            upvotesid: props.userData.username,
            downvotesid: "-1",
            comment: "-1"
          }
          
          handleUpdatePost(UpdatePost);

        }} aria-label="no. of posts">

          {upvotes.includes(props.userData.username) ?
          <ThumbUpIcon color="primary"/> : <ThumbUpOutlinedIcon />} 
          <Typography variant="subtitle2" color={
            upvotes.includes(props.userData.username) ? "primary":null
          }>
            {upvotes?.length}
          </Typography>
        </IconButton>
        <IconButton onClick={() => {
          let UpdatePost = {
            id:subid,
            postid: id,
            upvotesid: "-1",
            downvotesid: props.userData.username,
            comment: "-1"
          }

          handleUpdatePost(UpdatePost);

        }} aria-label="no. of people">
          {downvotes.includes(props.userData.username) ?
          <ThumbDownIcon color="primary"/> : <ThumbDownOutlinedIcon />} 
          <Typography variant="subtitle2" color={
            downvotes.includes(props.userData.username) ? "primary":null
          }>
          {downvotes?.length}
          </Typography>
        </IconButton>
        <Button size="small" onClick={() => {
          const SavedPost = {
            subid: subid,
            postid: id, 
            savedby: props.userData.username,
          };
          handleRemoveSavedPost(SavedPost);
        }}>REMOVE</Button>
      </CardActions>
    </React.Fragment>
    );
  };

  return (
    <div>
      <h1>Saved Posts</h1>
      {AkaSubGreddits?.map((subgreddit) => (
        subgreddit?.post?.map((postobj) => (
          // postobj
          postobj.savedby.includes(props.userData.username) ?
          <Box key={postobj.id} sx={{ minWidth: 275}}>
            <Card variant="outlined">{card(subgreddit._id,postobj.id,subgreddit.name,postobj.postedBy,postobj.Text,postobj.upvotes,postobj.downvotes,postobj.comments)}</Card>
          </Box> : null
        ))
      ))}
    </div>
  );
}

export default SavedPost;