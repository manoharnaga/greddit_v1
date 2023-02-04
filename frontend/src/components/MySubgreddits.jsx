import { useState, useEffect } from "react";
import { Navigate, useLocation , useNavigate} from "react-router-dom";

const MySubGreddits = (props) => {
  const [tags, setTags] = useState([]);
  const [bannedKeywords, setBannedKeywords] = useState([]);
  const [SubGredditDisabled, setSubGredditDisabled] = useState(1);
  const [SubGredditData, setSubGredditData] = useState({
    moderator: "",
    name: "",
    description: "",
    users: ["u1","u2","u3","u4","u5"],
    requests: ["r1","r2","r3","r4","r5"],
    blocked: ["b1","b2","b3"],
    tags: [],
    bannedKeywords: [],
  });

  const [MySubGreddits,setMySubGreddits] = useState();
  let navigate = useNavigate();

  let location = useLocation();
  useEffect(() => {
    // function to be called on page load/refresh
    const SubgredditObj = () => {
      console.log("Page loaded/refreshed");
      fetch(`http://localhost:5000/mysubgreddits/data`, {
        method: "POST",
        crossDomain: true,
        body: JSON.stringify({
          moderator: JSON.parse(localStorage.getItem("username")),
          name: "none",
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "mysubgreddits sent") {
            const MySubgreddits = data.MySubgreddits;
            setMySubGreddits(MySubgreddits);
          } else {
            console.log(
              "Unable to fetch MySubgreddit Data! - MySubgreddit.jsx"
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

  const addTags = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      // Single word && LowerCase
      if (e.target.value.search(" ") !== -1) {
        alert("Tags should be Single Word!");
      } else if (/[A-Z]/.test(e.target.value)) {
        alert("Please use Lowercase in Tags!");
      } else {
        setTags([...tags, e.target.value]);
      }
      e.target.value = "";
    }
  };

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  const addBannedKeyword = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      // Single Word
      if (e.target.value.search(" ") !== -1) {
        alert("BannedKeywords should be Single Word!");
      } else {
        setBannedKeywords([...bannedKeywords, e.target.value]);
      }
      e.target.value = "";
    }
  };

  const removeBannedKeyword = (index) => {
    setBannedKeywords([
      ...bannedKeywords.filter(
        (banned) => bannedKeywords.indexOf(banned) !== index
      ),
    ]);
  };

  const handleSubGredditChange = (e) => {
    setSubGredditData({
      ...SubGredditData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "name") {
      console.log(!(e.target.value.length > 0));
      setSubGredditDisabled(!(e.target.value.length > 0));
    }
  };

  const handleSubGreddit = (e) => {
    // if (e.key === 'Enter'){
    //   e.preventDefault();
    //   console.log("Enter is Pressed!");
    // }

    e.preventDefault();
    if (SubGredditDisabled) return;

    // setSubGredditData();
    console.log(props.userData.username);
    
    fetch(`http://localhost:5000/mysubgreddits/add`, {
      method: "POST",
      crossDomain: true,
      body: JSON.stringify({
        ...SubGredditData,
        moderator: props.userData.username,
        tags: tags,
        bannedKeywords: bannedKeywords,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // window.location.reload(false);
      })
      .catch((error) => console.error("Error:", error));
  };


  const DeleteSubGreddit = (_id) => {
    fetch(`http://localhost:5000/mysubgreddits/delete`, {
      method: "DELETE",
      // crossDomain: true,
      body: JSON.stringify(_id),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // window.location.reload(false);
    })
    .catch((error) => console.error("Error:", error));
  };


  const OpenSubGreddit  = (_id) => {
    console.log("Mysubgreddit in New Page!",_id);
    navigate(`/mysubgreddits/${_id}`,{state:{id:_id}});
  };

  return (
    <div>
      <h1>My SubGreddiits</h1>
      <form onSubmit={handleSubGreddit}>
        <label>Name: </label>
        <input
          onChange={handleSubGredditChange}
          type="text"
          name="name"
          placeholder="Enter the name.."
        />
        <br />
        <label>Description:</label>
        <br />
        <textarea
          onChange={handleSubGredditChange}
          name="description"
          placeholder="Enter your text here"
        ></textarea>
        <br />
        <label>Tags:</label>
        <div className="tags-input">
          <ul id="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{tag}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => removeTags(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyDown={(e) => addTags(e)}
            placeholder="Press SPACE to add tags.."
          />
        </div>
        <br />
        <label>Banned Keywords:</label>
        <div className="tags-input">
          <ul id="tags">
            {bannedKeywords.map((banned, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{banned}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => removeBannedKeyword(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyDown={(e) => addBannedKeyword(e)}
            placeholder="Press SPACE to add banned keywords.."
          />
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          disabled={SubGredditDisabled}
        >
          Submit
        </button>
      </form>

      <table>
        <tbody>
          {MySubGreddits?.map((subgreddit,index) => (
            <tr key={index}>
              <td>{subgreddit.users.length}</td>
              <td>{subgreddit.name}</td>
              <td>{subgreddit.description}</td>
              <td><input className="btn btn-lg btn-info" type="button" onClick={() => DeleteSubGreddit(subgreddit._id)} name="deleteSubgreddit" value="Delete"/></td>
              <td><input className="btn btn-lg btn-info" type="button" onClick={() => OpenSubGreddit(subgreddit._id) } name="openSubgreddit" value="Open"/></td>
              {/* print comma separated banned keyword */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MySubGreddits;
