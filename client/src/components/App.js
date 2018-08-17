import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../actions';


import Header from './Header';
import Landing from './Landing';
import SurveyNew from './surveys/SurveyNew';
import StarView from './stars/StarView';
const Dashboard = () => <h2> Dashboard </h2>

class App extends Component {
  // preferred for ajax requests
  componentDidMount() {
      this.props.fetchUser();
      this.props.getStars();
  }

  render() {
    return(
      <div className="container">
        <BrowserRouter>
            <div>
              <Header />
              <Route exact path="/" component={Landing} />
              <Route exact path="/surveys" component={Dashboard} />
              <Route path="/surveys/new" component={SurveyNew} />
              <Route path="/star/view" component={StarView} />
            </div>
        </BrowserRouter>
      </div>
    );
  }


};

export default connect(null, actions)(App);
