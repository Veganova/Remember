import React, { Component } from 'react';
import './styles/Landing.scss';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';


class Landing extends Component {

  renderLogin() {
    return (
      <div className='centered'>
        <h3>Login and take notes!</h3>
        <a href="/auth/google">
          <i className="fa fa-user icon-login"/>
        </a>
      </div>
    );
  }

  render() {
    switch(this.props.auth) {
      case null:
        // Don't know login status yet
        return <div>Loading...</div>;
      case false:
        // Note logged in yet
        return this.renderLogin();
      default:
        // Already logged in, go to notes
        return <Redirect to='/notes'/>
    }
  };
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Landing);