import { Navigate } from "react-router-dom";
import { useState } from "react";

const MySubGreddits = (props) => {
  const [tags, setTags] = useState([]);
  const [bannedKeywords, setBannedKeywords] = useState([]);

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  const addBannedKeyword = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setBannedKeywords([...bannedKeywords, event.target.value]);
      event.target.value = "";
    }
  };

  const removeBannedKeyword = (index) => {
    setBannedKeywords([...bannedKeywords.filter((banned) => bannedKeywords.indexOf(banned) !== index)]);
  };


  return (
    <div>
      <h1>My SubGreddiits</h1>
      <form action="">
        <label>Name: </label>
        <input type="text" name="name" placeholder="Enter the name.." />
        <br />
        <label>Description:</label>
        <br />
        <textarea
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
                <span className="tag-close-icon" onClick={() => removeTags(index)}>
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyUp={(event) => addTags(event)}
            placeholder="Press enter to add tags.."
          />
        </div>
        <br />
        <label>Banned Keywords:</label>
        <div className="tags-input">
          <ul id="tags">
            {bannedKeywords.map((banned, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{banned}</span>
                <span className="tag-close-icon" onClick={() => removeBannedKeyword(index)}>
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyUp={(event) => addBannedKeyword(event)}
            placeholder="Press enter to add banned keywords.."
          />
        </div>
      </form>
    </div>
  );
};

export default MySubGreddits;
