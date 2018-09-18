import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
        return;
      case false:
        return <a className="nav-item nav-link" href="/auth/google">Login</a>
      default:
        return <a className="nav-item nav-link" href="/api/logout">Logout</a>
    }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/"><i className="fa fa-home"/></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-item nav-link active" to="/"><span className="sr-only">(current)</span></Link>
              <Link className={ "nav-item nav-link " + (!this.props.auth && "disabled")}to={this.props.auth ? '/notes' : '/'}>Notes <span className="sr-only">(current)</span></Link>
              {this.renderContent()}
            </div>
          </div>

      </nav>
    );
  }
}


function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
