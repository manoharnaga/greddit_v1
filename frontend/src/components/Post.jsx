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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

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
  const [SubGredditData, setSubGredditData] = useState({obj:"dsfds"});
  const [PostDisabled, setPostDisabled] = useState(true);
  const [Text, setText] = useState('');

  const [CommentDisabled, setCommentDisabled] = useState(true);
  const [Comment, setComment] = useState('');
  // const [Post, setPost] = useState({
  //   postedBy: "emptyq",
  //   Text: "qwerty",
  //   upvotes: 3,
  //   downvotes: 5,
  //   comments: ["onec"]
  // });


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let location = useLocation();

  // localStorage.setItem('subgredditdata',JSON.stringify(SubGredditData));

  useEffect(() => {
    const _id = localStorage.getItem('akasubgredditId');
    // let akaPostFlag = localStorage.getItem('akapostflag');
    // const SubGredditDatalocal = JSON.parse(localStorage.getItem('subgredditdata'));
    // if(akaPostFlag !== 2){
    //   akaPostFlag = 1;
    //   localStorage.setItem('akasubgredditId', 2);
    // }
    // else{
    //   akaPostFlag = 2;
    // }

    const getSubGredditData = async () => {
      console.log("Page Loaded/Refreshed");
      await fetch(`http://localhost:7000/akasubgreddits/data`, {
        method: 'POST',
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
    getSubGredditData();

  },[location.pathname]);
  
  const handlePostTextChange = (e) => {
    console.log(e.target.value);
    setText(e.target.value);
    setPostDisabled(!(e.target.value.length > 0));
  };

  const handlePostCommentChange = (e) => {
    console.log(e.target.value);
    setComment(e.target.value);
    setCommentDisabled(!(e.target.value.length > 0));
  };
  const handleSubGreddit = (e) => {
    e.preventDefault();
    if (PostDisabled) return;

    fetch(`http://localhost:7000/akasubgreddits/addpost`, {
      method: "PUT",
      crossDomain: true,
      body: JSON.stringify({
        postedBy: props.userData.username,
        postedIn: SubGredditData._id,
        Text: Text,
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

  const handleSavePost = async (SavedPost) => {
    await fetch(`http://localhost:7000/savepost/add`, {
      method: 'POST',
      crossDomain: true,
      body: JSON.stringify(SavedPost),
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

  
  const card = (id,postedBy,Text,upvotes,downvotes,comments) => {
    return (
      <React.Fragment>
        <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
            M
          </Avatar>
        }
        action={
          <Button size="small">
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
        <Link href="#" underline="none">
          Comments
        </Link>
        <TextField id="standard-basic" label="Standard" variant="standard" name="comment" onChange={handlePostCommentChange}/>
        <Button disabled={CommentDisabled} onClick={() =>{
          setSubGredditData(prevState => {
            prevState.post[id].comments.push(Comment);
            return {
              ...SubGredditData,
              post: prevState.post
            }
          });
        }
        }>SAVE</Button>
        <Button onClick={() => {
          setComment('');
          setCommentDisabled(false);
        }}>CANCEL</Button>

        {comments?.map((comment,index) => (
          <Typography key={index} variant="body2">
            {comment}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => {
          setSubGredditData(prevState => {
            prevState.post[id].upvotes = prevState.post[id].upvotes + 1;
            return {
              ...SubGredditData,
              post: prevState.post
            }
          });
        }} aria-label="no. of posts">
          <ThumbUpIcon />
          <Typography variant="body2">
            {upvotes}
          </Typography>
        </IconButton>
        <IconButton onClick={() => {
          setSubGredditData(prevState => {
            prevState.post[id].downvotes = prevState.post[id].downvotes + 1;
            return {
              ...SubGredditData,
              post: prevState.post
            }
          });
        }} aria-label="no. of people">
          <ThumbDownIcon />
          <Typography variant="subtitle2">
          {downvotes}
          </Typography>
        </IconButton>
        <Button size="small" onClick={() => {
          const SavedPost = {
            subgreddit: SubGredditData.name,
            moderator: SubGredditData.moderator,
            postedBy: postedBy,
            postedIn: SubGredditData._id,
            Text: Text,
            upvotes: upvotes,
            downvotes: downvotes,
            comments: SubGredditData.post[id].comments
          };
          handleSavePost(SavedPost);
        }}>SAVE</Button>
      </CardActions>
    </React.Fragment>
    );
  };

  // console.log(SubGredditData);

  return (
  <div>
      <div>

      </div>
      <div>
          <Button onClick={handleOpen}>CREATE POST</Button>
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
      <h1>Posts Page</h1>
      {SubGredditData?.post?.map((postobj) => (
        <Box key={postobj.id} sx={{ minWidth: 275}}>
          <Card variant="outlined">{card(postobj.id,postobj.postedBy,postobj.Text,postobj.upvotes,postobj.downvotes,postobj.comments)}</Card>
        </Box>
    ))}
  </div>
  );
}


export default Post;
