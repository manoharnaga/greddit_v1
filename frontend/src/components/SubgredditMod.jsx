import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


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

const SubGredditMod = () => {
    const [SubGredditData, setSubGredditData] = useState({
      moderator: "",
      name: "",
      description: "",
      joined: ["u123"],
      requested: ["r145"],
      blocked: ["b374"],
      tags: [],
      bannedKeywords: [],
      post: []
    });
    
    const [value, setValue] = useState(0);

    let location = useLocation();
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


    const handleChange = (event, newValue) => {
      setValue(newValue);
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
                    {SubGredditData.joined?.map((user,index) => (
                        <tr key={index}>
                            <td>{user}</td>
                        </tr>
                    ))}
                    {SubGredditData.blocked?.map((blocked,index) => (
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
                    {SubGredditData.requested?.map((user,index) => (
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
          Tab 3 Content
        </TabPanel>
      </Box>
    </div>
    );
}

export default SubGredditMod;




    
    
