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
            <div> {this.displayStar(star)} </div> <button onClick={() => {this.props.removeStar(star["_id"])}}> X </button>
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
    return (
      <div>
        {this.displayAllStars()}
        <button onClick={this.addStarAction}>Add Function</button>
      </div>
    )
  }

  getStarWithData(stars, data) {
    for (let i = 0; i < stars.length; i++) {
      if (data === stars[i]['data']) {
        return stars[i];
      }
      let childStar = this.getStarWithData(stars[i].childStars, data);
      if (childStar) {
        return childStar;
      }
    }
    return null;
  }

  addStarAction() {
    var d = new Date();

    const star = this.getStarWithData(this.props.star, 'Stars');
    this.props.addStar(star['_id'], d.getHours() + ":" + d.getMinutes() +":"+ d.getSeconds());
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
