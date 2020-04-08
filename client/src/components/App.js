import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../actions/starActions';
import Header from './Header';
import Landing from './Landing';
import StarView from './stars/StarView';
import Popup from "./general/Popup";
import "./styles/App.scss";

class App extends Component {
  // preferred for ajax requests
  componentDidMount() {
      this.props.fetchUser();
      this.props.getStars();
  }

  render() {
    return(
      <div >
        <BrowserRouter>
            <div>
              <Route exact path="/" component={Landing} />
              <Route path="/notes" component={StarView} />
            </div>
        </BrowserRouter>
        <Popup />
      </div>
    );
  }
};

export default connect(null, actions)(App);
