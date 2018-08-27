import _ from 'lodash';
import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import * as actions from '../../actions';
import { formatStars } from '../../helpers';
import Nestable from 'react-nestable';
import axios from 'axios';

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

  OLDdisplayStarsFull(listOfStars) {
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

  displayStarsFull(listOfStars) {
    const items = listOfStars;
    return (
      <Nestable
        ref={(child) => { this._child = child; }}
        items={items}
        childrenProp = "childStars"
        renderItem={({ item })=> item.data}
        onChange={(arg, arg2) => {
          console.log("after");
          this._child.dragRevert();
        }}
        onMove={(arg, arg2) => {
          console.log(this._child);
          return true;
        }}
      />
    )
  }

  timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  displayAllStars(formattedStars) {
    return (
      <div>
          {this.displayStars(formattedStars)}
          {this.displayChildStars(formattedStars)}
      </div>
    )
  }

  render() {
    if (this.props.star && this.props.auth) {
    const formattedStars = formatStars(this.props.auth['_id'], this.props.star);
    return (
      <div>
        {this.displayAllStars(formattedStars)}
        <button onClick={this.addStarAction}>Add Function</button>
      </div>
    )
  }
  else {
    return (
      <div>Loading ...</div>
    )
  }
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

function mapStateToProps({ auth, star }) {
  return { auth, star };
}

export default connect(mapStateToProps, actions)(StarView);
