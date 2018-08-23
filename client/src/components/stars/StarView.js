import _ from 'lodash';
import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import * as actions from '../../actions';

class StarView extends Component {

  displayStars(listOfStars) {
    return (
      <ul className="nav nav-tabs">
      { _.map(listOfStars, (star) => {
        return <li key={star['_id']} className="active nav-item"><a className="nav-link" data-toggle="pill" href={'#' + star.data}>{star.data}</a></li>
      })}
      </ul>
    )
  }

  displayStar(star) {
    return star.data;
  }

  displayStarsFull(listOfStars) {
    return (
    <ul className="collection">
      { _.map(listOfStars, (star) => {
        return (
          <li key={star["_id"]} className="collection-item">
            <div> {this.displayStar(star)} </div>
            <div> {this.displayStarsFull(star.childStars)} </div>
          </li>
      )
    })}
    </ul>
  )
  }

  displayChildStars(listOfStars) {
    return (
      <div className="tab-content">
      {_.map(listOfStars, (star) => {
        return <div key={star['_id']} id={star.data} className="tab-pane fade in active">{this.displayStarsFull(star.childStars)} </div>
      })}
      </div>
    )

  }

  displayAllStars() {
    return (
      <div>
          {this.props.star ? this.displayStars(this.props.star) : "loading"}
          {this.props.star && this.displayChildStars(this.props.star)}
      </div>
    )
  }

  render() {
      console.log('rendering!');
    return (
      <div>
        {this.displayAllStars()}
        <button onClick={this.addStarAction}>Add Function</button>
        <div>{JSON.stringify(this.props.star)}</div>
      </div>
    )
  }

  addStarAction() {
    this.props.addStar('', 'justaddedbyreact8');
  }

  constructor(props) {
    super(props);
    this.addStarAction = this.addStarAction.bind(this);
  }
}

function mapStateToProps({ star }) {
  return { star };
}

export default connect(mapStateToProps, actions)(StarView);
