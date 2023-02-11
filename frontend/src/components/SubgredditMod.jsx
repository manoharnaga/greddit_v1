import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SubGredditMod = (props) => {
    let location = useLocation();
    const [SubGredditData, setSubGredditData] = useState(() => {
      console.log('heloy');
      localStorage.setItem('modsubgredditId',location.pathname.substring(location.pathname.lastIndexOf('/') + 1));
    });
    const [ignoreReport,setIgnoreReport] = useState(false);
    const [blockSeconds, setBlockSeconds] = useState(3);
    const [blockData, setBlockData] = useState({});

    const [value, setValue] = useState(0);

    useEffect(() => {
      const _id = localStorage.getItem('modsubgredditId');
      const getSubGredditData = async () => {
        console.log("Page Loaded/Refreshed");
        await fetch(`http://localhost:7000/mysubgredditsmod/data`, {
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
            if (data.status === "modsubgredditUsers sent") {
              const MySubgredditData = data.MySubgreddit;
              setSubGredditData(MySubgredditData);
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
    

    useEffect(() => {
      let interval = null;
      if (blockData.isBlockActive && blockSeconds>0) {
        interval = setInterval(() => {
          setBlockSeconds(seconds => seconds - 1);
        }, 1000);
      } else if (!blockData.isBlockActive || blockSeconds === 0) {
        clearInterval(interval);
        if(blockSeconds === 0){
          blockReportedUser(blockData);
        }
      }
      return () => clearInterval(interval);
    }, [blockData, blockSeconds]);


    const handleRequest = async (username,flagRequest) => {
      await fetch(`http://localhost:7000/mysubgredditsmod/request`, {
        method: 'PUT',
        crossDomain: true,
        body: JSON.stringify({id:location.state.id,username:username,flagRequest:flagRequest}),
        headers: {
            'Content-Type': 'application/json',
            Accept:"application/json",
            "Access-Control-Allow-Origin": "*",
        }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "joiningRequest Successfull!"){
              console.log("joiningRequest",data);
              const updatedSubGreddit = data.SubgredditData;
              setSubGredditData(updatedSubGreddit);
            }
            else{
              console.log("Error Updating Joining Requests!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    const DeletePostReport = (subid,postid,postobjid,reportid) => {
      fetch(`http://localhost:7000/mysubgredditsmod/delpost`, {
        method: "PUT",
        crossDomain: true,
        body: JSON.stringify({
          subid:subid,
          postid:postid,
          postobjid: postobjid,
          reportid:reportid}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.status === "Post Deleted by moderator Successfull!"){
          console.log("post deleted by moderator successfull",data);
          const updatedSubGreddit = data.SubgredditData;
          setSubGredditData(updatedSubGreddit);
        }
        else{
          console.log("Error deleting reported Postx!");
        }
    })
      .catch((error) => console.error("Error:", error));
    };


    const blockTimer = (subid,reportedVictim,reportobj_id) => {
      setBlockSeconds(3);
      setBlockData({
        isBlockActive: true,
        subid:subid,
        reportedVictim:reportedVictim,
        reportobj_id: reportobj_id
      })
    };

    const blockReportedUser = (blockDataObj) => {
      fetch(`http://localhost:7000/mysubgredditsmod/blockuser`, {
        method: "PUT",
        crossDomain: true,
        body: JSON.stringify({
          subid: blockDataObj.subid,
          reportedVictim: blockDataObj.reportedVictim
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.status === "reportedUser block Successfull!"){
          console.log("reportedUser block Successfull...",data);
          const updatedSubGreddit = data.SubgredditData;
          setBlockData({isBlockActive: false});
          setSubGredditData(updatedSubGreddit);
        }
        else{
          console.log("Error blocking reported user - frontend!");
        }
    })
      .catch((error) => console.error("Error:", error));
    };

    const handleChange = (event, newValue) => {
      if(newValue === 3){
        delTimedOutReports();
      }
      setValue(newValue);
    };

    const delTimedOutReports = () => {
      fetch(`http://localhost:7000/mysubgredditsmod/deltimedoutreports`, {
        method: "PUT",
        crossDomain: true,
        body: JSON.stringify({subid:SubGredditData?._id}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("deleteTimedOutReports",data);
        if(data.status === "deleteTimedOutReports Successfull!"){
          const updatedSubGreddit = data.SubgredditData;
          setSubGredditData(updatedSubGreddit);
        }
        else{
          console.log("Error deleting timed out reports!");
        }
    })
      .catch((error) => console.error("Error:", error));
    };

    const card = (postid,postobj_id,reportobj_id,reportedBy,reportedVictim,concern,Text) => {
      return (
        <React.Fragment>
        <CardContent>
          <table>
            <tbody>
            <tr>
              <td>
                <Typography variant="body1">
                  Reported By: 
                </Typography>
              </td>
              <td>
                <Typography variant="body1">
                  {reportedBy}
                </Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography variant="body1">
                  Reported Victim:
                </Typography>
              </td>
              <td>
                <Typography variant="body1">
                  {reportedVictim}
                </Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography variant="body1">
                  Concern:
                </Typography>
              </td>
              <td>
                <Typography variant="body1">
                  {concern}
                </Typography>
              </td>
            </tr>
            <tr>
              <td>
                <Typography variant="body1">
                  Text:
                </Typography>
              </td>
              <td>
                <Typography variant="body1">
                  {Text}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </CardContent>
        <CardActions>
          {SubGredditData.blocked.includes(reportedVictim) ?
            <Button size="small" disabled>BLOCKED</Button> 
            : 
            (blockData.isBlockActive && blockData.reportobj_id===reportobj_id) ? 
              <Button size="small" onClick={() => {
                setBlockData({isBlockActive: false});
                // blockReportedUser(SubGredditData?._id,reportedVictim);
              }} disabled={ignoreReport}>CANCEL IN {blockSeconds}</Button> 
              : 
              <Button size="small" onClick={() => {
                blockTimer(SubGredditData?._id,reportedVictim,reportobj_id);
              }} disabled={ignoreReport}>BLOCK</Button>
          }
          <Button size="small" onClick={() => {
            DeletePostReport(SubGredditData?._id,postid,postobj_id,reportobj_id);
          }} disabled={ignoreReport}>DELETE POST</Button>
          <Button size="small" onClick={() => {
            setIgnoreReport(true);
          }}>IGNORE</Button>
        </CardActions>
      </React.Fragment>
      );
    };

    return (
      <div>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Joining Requests" {...a11yProps(1)} />
            <Tab label="Stats" {...a11yProps(2)} />
            <Tab label="Reported" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div>
            <table>
                <tbody>
                    {SubGredditData?.joined?.map((user,index) => (
                        <tr key={index}>
                            <td>{user}</td>
                        </tr>
                    ))}
                    {SubGredditData?.blocked?.map((blocked,index) => (
                        <tr key={index}>
                            <td>{blocked}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <table>
                <tbody>
                    {SubGredditData?.requested?.map((user,index) => (
                        <tr key={index}>
                            <td>{user}</td>
                            <td>
                                <button className="btn btn-lg btn-info" onClick={() => {handleRequest(user,1)}}>Accept</button>
                            </td>
                            <td>
                                <button className="btn btn-lg btn-info" onClick={() => {handleRequest(user,2)}}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h1>Stats</h1>
        </TabPanel>
        <TabPanel value={value} index={3}>
          {SubGredditData?.post?.map((postobj) => (
            postobj?.report?.map((reportobj,index) => (
              <Box key={index} sx={{ minWidth: 275}}>
                <Card variant="outlined">{card(postobj.id,postobj._id,reportobj._id,reportobj.reportedBy,reportobj.reportedVictim,reportobj.concern,reportobj.Text)}</Card>
              </Box>
            ))
          ))}
        </TabPanel>
      </Box>
    </div>
    );
}

export default SubGredditMod;




    
    
