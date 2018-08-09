import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
        return;
      case false:
        return <li><a href="/auth/google">Login</a></li>;
      default:
        return <li><a href="/api/logout">out</a></li>
    }
  }

  render() {
    console.log(this.props);
    return (
      <nav>
          <div className="nav-wrapper">
              <a className="left brand-logo">
                Remember
              </a>
              <ul className="right">
                {this.renderContent()}
              </ul>
          </div>;
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
