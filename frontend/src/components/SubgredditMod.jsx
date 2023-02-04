import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tab, Tabs, Navbar } from 'react-bootstrap';



const SubGredditMod = () => {
    // const [Users, setUsers] = useState([]);
    // const [Blocked, setBlocked] = useState([]);

    const [SubGredditData, setSubGredditData] = useState({
      moderator: "",
      name: "",
      description: "",
      users: ["u12"],
      requests: ["r137"],
      blocked: ["b34"],
      tags: [],
      bannedKeywords: [],
    });
    const [key, setKey] = useState("Users");
    let location = useLocation();
    
    const getSubGredditData = async () => {
      await fetch(`http://localhost:5000/mysubgredditsmod/data`, {
        method: "POST",
        crossDomain: true,
        body: JSON.stringify({id: location.state.id}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "modsubgredditUsers sent") {
            const MySubgredditData = data.SubgredditData;
            setSubGredditData(MySubgredditData);
          } else {
            console.log(
              "Unable to fetch ModSubgreddit Users! - SubgredditMod"
            );
          }
        })
        .catch((error) => console.error("Error:", error));
    };


    const handleRequest = async (username,flagRequest) => {
      await fetch(`http://localhost:5000/mysubgredditsmod/request`, {
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

    const handleTabClick = (tabKey) => {
      setKey(tabKey);
      console.log("SubGredditData",SubGredditData);
      if(tabKey === "Users"){
        getSubGredditData();
      }
      // console.log(`Tab with key ${tabKey} was clicked!`);
    };
    
    return (
      <Navbar bg="light">
      <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={handleTabClick}
        >
        <Tab eventKey="Users" title="Users">
          <div>
            <table>
                <tbody>
                    {SubGredditData.users?.map((user,index) => (
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
        </Tab>
        <Tab eventKey="joiningRequest" title="Tab 2">
          <div>
            <table>
                <tbody>
                    {SubGredditData.requests?.map((user,index) => (
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
        </Tab>
        <Tab eventKey="contact" title="Tab 3">
          Tab 3 Content
        </Tab>
      </Tabs>
      </Navbar>
    );
}

export default SubGredditMod;




    
    
