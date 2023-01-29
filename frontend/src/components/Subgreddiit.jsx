import { Link } from 'react-router-dom';

function SubGredditNavbar() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </div>
  );
}

export default SubGredditNavbar;
