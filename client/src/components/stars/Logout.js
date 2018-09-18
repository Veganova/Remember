import React from 'react';
import '../styles/Logout.css';

export default () => {
  return (
      <div className="row justify-content-end" >
        <div className="center-logout">
          <a href="/api/logout" className="icon-logout">
            <i className="fa fa-sign-out center-logout2"/>
          </a>
        </div>
      </div>
  )
}