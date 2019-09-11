import React from 'react';
import { BrowserRouter as Router,  Link} from "react-router-dom";

const NotFoundPage = () =>
  <div>
    <button className="ms-Button">
        <span className="ms-Button-label"><Link to="/">Back to Homepage</Link>
        </span>
    </button>
    <h1>404 page not found</h1>
    <h4>We are sorry but the page you are looking for does not exist.</h4>
  </div>

export default NotFoundPage;