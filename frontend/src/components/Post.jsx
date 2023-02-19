import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
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
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Grid from '@mui/material/Grid';
import backgroundImage from '../butterfly.jpg';
import Navbar from "./Navbar"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    '& > :not(style)': { m: 1, width: '30ch' }
};


const Post = (props) => {
  let location = useLocation();
  const [SubGredditData, setSubGredditData] = useState(() => {
    // console.log('helox');
    localStorage.setItem('akasubgredditId',location.pathname.substring(location.pathname.lastIndexOf('/') + 1));
  });
  
  const [PostDisabled, setPostDisabled] = useState(true);
  const [Text, setText] = useState('');

  const [CommentDisabled, setCommentDisabled] = useState(true);
  const [Comment, setComment] = useState('');

  const [ReportDisabled, setReportDisabled] = useState(true);
  const [concernText, setConcernText] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openReport, setOpenReport] = useState(false);
  const handleOpenReport = () => setOpenReport(true)
  const handleCloseReport = () => setOpenReport(false);

  // localStorage.setItem('subgredditdata',JSON.stringify(SubGredditData));
  // console.log(location.pathname.substring(location.pathname.lastIndexOf('/') + 1));

  useEffect(() => {
    const _id = localStorage.getItem('akasubgredditId');
    
    // const SubGredditDatalocal = JSON.parse(localStorage.getItem('subgredditdata'));

    const getSubGredditData = async () => {
      console.log("Page Loaded/Refreshed");
      await fetch(`http://localhost:7000/akasubgreddits/data`, {
        method: "POST",
        crossDomain: true,
        body: JSON.stringify({id:_id}),
        headers: {
          'Content-Type': 'application/json',
          Accept:"application/json",
          "Access-Control-Allow-Origin": "*",
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "AkasubgredditPost sent") {
            const AkaSubgredditPost = data.AkaSubgredditPost;
            setSubGredditData(AkaSubgredditPost);
          } else {
            console.log(
              "Unable to fetch ModSubgreddit Users! - SubgredditMod"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error)
        });
    };
    if (JSON.parse(localStorage.getItem("login-key")) === "true") {
      getSubGredditData();
    }
  },[]);
  
  const handlePostConcernChange = (e) => {
    setConcernText(e.target.value);
    setReportDisabled(!(e.target.value.length > 0));
  };

  const handlePostCommentChange = (e) => {
    setComment(e.target.value);
    setCommentDisabled(!(e.target.value.length > 0));
  };

  const handlePostTextChange = (e) => {
    setText(e.target.value);
    setPostDisabled(!(e.target.value.length > 0));
  };

  const handleSubGreddit = (e) => {
    e.preventDefault();
    if (PostDisabled) return;
    const banTextArr = Text.split(" ");
    let isBannedWord = 0
    const newTextArr = banTextArr.map((word) => {
      return (
        SubGredditData?.bannedKeywords?.map((banword) => {
            if(banword?.toLowerCase()?.includes(word.toLowerCase())){
              isBannedWord = 1;
              return "*";
            }
            else{
              return word;
            }
        })
      );
    })
    
    if(isBannedWord){
      alert("You are using Banned KeyWords of the Subgreddit!");
    }

    const finalText = newTextArr.join(" ");

    fetch(`http://localhost:7000/akasubgreddits/addpost`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify({
        postedBy: props.userData.username,
        postedIn: SubGredditData._id,
        Text: finalText,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("post reached server!",data);
        if(data.status === "Post Created Successfully!"){
          setSubGredditData(data.SubgredditData);
        }
        // window.location.reload(false);
      })
      .catch((error) => console.error("Error:", error));
  };


  const handleSubGredditReport = async (postobj_id,postid,reportedVictim, Text, TimeInms) => {
    if (ReportDisabled) return;

    await fetch(`http://localhost:7000/akasubgreddits/reportpost`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify({
        postobj_id: postobj_id,
        postedIn: SubGredditData._id,
        postid: postid,
        reportedBy: props.userData.username,
        reportedVictim: reportedVictim,
        concern: concernText,
        Text: Text,
        CreateTimeInms: TimeInms
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Report reached server!",data);
        if(data.status === "Report Sent Successfully!"){
          setSubGredditData(data.SubgredditData);
        }
      })
      .catch((error) => console.error("Error:", error));
  };


  const handleSavedPost = async (SavedPost) => {
    await fetch(`http://localhost:7000/savedpost/add`, {
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
      if(data.status === "Saved Post Successfully!"){
        setSubGredditData(data.SubgredditData);
        
      }
    })
    .catch(error => console.error('Error:', error));
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
          setSubGredditData(data.SubgredditData);
        }
      })
      .catch((error) => console.error("Error:", error));
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

  
  const card = (postobj_id,id,postedBy,Text,upvotes,downvotes,comments) => {
    return (
      <React.Fragment>
        <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
            M
          </Avatar>
        }
        action={
            props.userData?.following?.includes(postedBy) ?
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
        title={postedBy}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body1">
          {Text}
        </Typography>
        <Link underline="none">
          Comments
        </Link>
        <TextField id="standard-basic" label="Standard" variant="standard" name="comment" onChange={handlePostCommentChange}/>
        <Button disabled={CommentDisabled} onClick={() =>{
          let voteUserId = props.userData.username;
          let UpdatePost = {
            id:SubGredditData._id,
            postid: id,
            upvotesid: "-1",
            downvotesid: "-1",
            comment: {
              comment: Comment,
              userId: voteUserId
            }
          }
          
          handleUpdatePost(UpdatePost);
          setComment('');
          setCommentDisabled(true);
        }
        }>SAVE</Button>
        <Button onClick={() => {
          setComment('');
          setCommentDisabled(true);
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
            id:SubGredditData._id,
            postid: id,
            upvotesid: props.userData.username,
            downvotesid: "-1",
            comment: "-1"
          }
          
          handleUpdatePost(UpdatePost);

        }} aria-label="no. of posts">

          {SubGredditData.post[id].upvotes.includes(props.userData.username) ?
          <ThumbUpIcon color="primary"/> : <ThumbUpOutlinedIcon />} 
          <Typography variant="subtitle2" color={
            SubGredditData.post[id].upvotes.includes(props.userData.username) ? "primary":null
          }>
            {upvotes?.length}
          </Typography>
        </IconButton>
        <IconButton onClick={() => {
          let UpdatePost = {
            id:SubGredditData._id,
            postid: id,
            upvotesid: "-1",
            downvotesid: props.userData.username,
            comment: "-1"
          }

          handleUpdatePost(UpdatePost);

        }} aria-label="no. of people">
          {SubGredditData.post[id].downvotes.includes(props.userData.username) ?
          <ThumbDownIcon color="primary"/> : <ThumbDownOutlinedIcon />} 
          <Typography variant="subtitle2" color={
            SubGredditData.post[id].downvotes.includes(props.userData.username) ? "primary":null
          }>
          {downvotes?.length}
          </Typography>
        </IconButton>


        <div className="ReportPost">
        <IconButton onClick={handleOpenReport} aria-label="no. of people">
          <ReportProblemOutlinedIcon /> 
          {/* : <ThumbDownOutlinedIcon /> */}
        </IconButton>
          <Modal
            open={openReport}
            onClose={handleCloseReport}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <Box
            component="form"
            sx={style}
            noValidate
            autoComplete="off"
            textAlign="center"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("frontend!",postedBy);
              let d = new Date();
              let TimeInms = d.getTime();
              handleSubGredditReport(postobj_id,id,postedBy,Text,TimeInms);
            }}
            className="mysubgreddit-inputform"
          >
            <TextField id="outlined-basic" name="Text" label="concern.." onChange={handlePostConcernChange} variant="outlined" multiline
            rows={3}/>
            <Button type="submit" variant="contained" disabled={ReportDisabled}>Submit</Button>
          </Box>
        </Modal>
        </div>


        {
          SubGredditData.post[id].savedby.includes(props.userData.username) ?
          <Button disabled>SAVED</Button> 
          :
          <Button size="small" onClick={() => {
            const SavedPost = {
              subid: SubGredditData._id,
              postid: id, 
              savedby: props.userData.username,
            };
            handleSavedPost(SavedPost);
          }}
          >
          SAVE</Button> 
        }
      </CardActions>
    </React.Fragment>
    );
  };

  // console.log(SubGredditData);

  return (
  <div>
      <Navbar Loginval={props.Loginval}
              Loginfunc={props.Loginfunc}
              userData={props.userData}
              setUserData={props.setUserData}/>
      <br /><br /><br /><br /><br />
      
      {/* <h1>Posts Page</h1> */}
      <div>
          <Box sx={{
            // position:'relative',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            }}>
            <Button variant="contained" onClick={handleOpen}>CREATE POST</Button>
          </Box>
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
            <Box
              component="form"
              sx={style}
              noValidate
              autoComplete="off"
              textAlign="center"
              onSubmit={handleSubGreddit}
              className="mysubgreddit-inputform"
            >
              <TextField id="outlined-basic" name="Text" label="Enter the Text here.." onChange={handlePostTextChange} variant="outlined" multiline
              rows={3}/>
              <Button type="submit" variant="contained" disabled={PostDisabled}>Submit</Button>
            </Box>
          </Modal>
      </div>
      <Grid container my={2}>
        <Grid item xs={12} md={4}  sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-out, opacity 1s ease-out',
          position:'fixed',
          height:'15rem',
          width:'15rem',
        }}>
          <h1 style={{opacity:1}}>{SubGredditData?.name}</h1>
          <h2>{SubGredditData?.description}</h2>
        </Grid>
        <Grid item xs={12} md={8} sx={{
          margin:'15rem',
        }}>
        {SubGredditData?.post?.map((postobj) => (
            <Box key={postobj.id} sx={{ minWidth: 275}}>
              <Card variant="outlined">{card(postobj._id,postobj.id,postobj.postedBy,postobj.Text,postobj.upvotes,postobj.downvotes,postobj.comments)}</Card>
            </Box>
        ))}
        </Grid>
      </Grid>
      
  </div>
  );
}


export default Post;
