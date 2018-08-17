import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class StarView extends Component {
  displayStar(star) {
    return star.data;
  }

      //<li key={star.id}>
       // {console.log(star.data)}
        //<h3> {star.data} </h3>
      //</li>
  displayStars(listOfStars) {
    return (
    <ul className="collection">
      {_.map(listOfStars, (star) => {
        return (
          <li key={star.id} className="collection-item">
          <div key={star.id}> {this.displayStar(star)} </div>
          <div key={star.id}> {this.displayStars(star.childStars)} </div>
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
