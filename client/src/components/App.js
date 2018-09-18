import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../actions';


import Header from './Header';
import Landing from './Landing';
import StarView from './stars/StarView';

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
      </div>
    );
  }


};

export default connect(null, actions)(App);
