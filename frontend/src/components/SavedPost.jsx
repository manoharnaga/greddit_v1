import { Navigate } from "react-router-dom";

const SavedPost = (props) => {
    if(props.Loginval === "false"){
        return <Navigate to="/login" />;
    }
    return (
        <h1>Saved Posts</h1>
    );
}

export default SavedPost;