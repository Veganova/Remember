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

  displayStars() {
    return (
      <ul className="nav nav-tabs">
      { _.map(this.formattedStars, (star) => {
        return <li key={star['_id']} className="active nav-item"><a className="nav-link" data-toggle="pill" href={'#' + star.data}>{star.data}</a></li>
      })}
      </ul>
    )
  }

  displayStar(star) {
    return (
        <div className="row">
              <div className="input-group col-12">
                <input className="form-control" type="text" value={"Index: " + star.index + ", Data " + star.data} />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={() => { this.props.removeStar(star.id, star.parentId)}} type="button">
                      <i className="fa fa-times" aria-hidden="true"></i> Remove
                    </button>
                  </div>
                </div>
        </div>
    )
  }

  displayChildStars() {
    let first = true;
    return (
      <div className="tab-content">
      {_.map(this.formattedStars, (star) => {
        const result =  (
          <div key={star['_id']} id={star.data} className={ "form-group tab-pane fade in" + (first && "active") }>
            {this.displayStarsFull(star.childStars, star.id)}
            <hr class="col-xs-12" />
            <div className="row mt-5">
              <div className="input-group col-12">
                <input className="form-control" placeholder="New Note" type="text"/>
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onSubmit={()=>console.log("hello")} type="submit">
                      <i className="fa fa-plus" aria-hidden="true"></i> Add
                    </button>
                  </div>
                </div>

            </div>
              <div>
                <div className="mt-2 float-right">
                  <button className="btn btn-danger" onClick={()=> { this.props.removeChildren(star.id)} }><i className="fa fa-minus"></i> Delete All</button>
                </div>
            </div>
           </div>
                  )
         first = false;
         return result;
      })}
      </div>
    )
  }

// state -> this.formattedStars.
// good for it to be global so that add can know where to add.. (but this is temporary.. can just loop over state )
// try updating state and have that rerender with all the correct data...
  displayStarsFull(items, parentId) {
    const parentIdHappy = parentId;
    return (
      <Nestable
        ref={(child) => {  }}
        items={items}
        childrenProp = "childStars"
        renderItem={(item)=> this.displayStar(item.item)}
        onChange={(items, updatedItem) => {
          // recurse through arg and find arg2 - figure out who the parent is

          const parentId = this.findInNestable(updatedItem, items, parentIdHappy);
          // this.props.updateStar();
          // let nestableIndex = -1;
          // for (let i = 0; this.formattedStars.length; i++) {
          //   if (this.formattedStars[i].id === parentId) {
          //     nestableIndex = i;
          //     break;
          //   }
          // }
          // this.formattedStars[nestableIndex].childStars = arg;
          console.log("after", items, parentId);
        }}
      />
    )
  }

  findInNestable(item, items, parentId) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        return parentId;
      }

      const result = this.findInNestable(item, items[i].childStars, items[i].id);
      if (result) {
        return result;
      }
    }
  }

  timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  displayAllStars() {
    return (
      <div>
          {this.displayStars()}
          {this.displayChildStars()}
      </div>
    )
  }


  render() {
    if (this.props.star && this.props.auth) {
      this.formattedStars = formatStars(this.props.auth['_id'], this.props.star);
      return (
          <div>
            {this.displayAllStars()}
            <button className="btn btn-success" onClick={this.addStarAction}><i className="fa fa-plus"></i> Note</button>

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
    for (let i = 0; stars.length; i++) {
      if (stars[i].data === data) {
        return stars[i];
      }
    }
  }

  getLargestIndexWithParentId(stars, parentId) {
    let largestIndex = 0;
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (star.parentId === parentId && largestIndex < star.index) {
        largestIndex = star.index;
      }
    }
    return largestIndex === 0 ? 0.5 : largestIndex;
  }

  addStarAction() {
    var d = new Date();
    console.log("addStaraction", this.props);
    const notesStarId = this.getStarWithData(this.props.star, 'Stars')['_id'];

    const index = (this.getLargestIndexWithParentId(this.props.star, notesStarId) + 1) / 2;
    this.props.addStar(notesStarId, d.getHours() + ":" + d.getMinutes() +":"+ d.getSeconds(), index);
  }

  constructor(props) {
    super(props);
    this.addStarAction = this.addStarAction.bind(this);
    this.displayStar = this.displayStar.bind(this);
  }
}

function mapStateToProps({ auth, star }) {
  return { auth, star };
}

export default connect(mapStateToProps, actions)(StarView);
