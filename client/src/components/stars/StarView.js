import _ from 'lodash';
import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {Tabs, Tab} from 'react-materialize';

class StarView extends Component {

  displayStar(star) {
    return star.data;
  }
  constructor(props) {
    super(props);
    this.asd = this.asd.bind(this);
  }
  asd(e) {
    console.log("tab");
  }

  displayStars(listOfStars) {
    return (
    <Tabs className='tab-demo z-depth-1' onLoad={()=>$('tab').tabs()}>
      { _.map(listOfStars, (star) => {
        return <Tab className='tab' key={star["_id"]} title={this.displayStar(star)} onClick={this.asd}>{this.displayStarsFull(star.childStars)}</Tab>
      })}
    </Tabs>
  )
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

  displayAllStars() {
    return (
      <div>
          {this.props.star ? this.displayStars(this.props.star) : "loading"}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.displayAllStars()}
      </div>
    )

  }
}

function mapStateToProps({ star }) {
  return { star };
}

export default connect(mapStateToProps)(StarView);
