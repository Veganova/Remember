import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {formatStars, searchAndFormatStars} from '../../helpers';
import Nestable from 'react-nestable';
import SingleStarView from "./SingleStarView";
import Fuse from 'fuse.js';

class StarView extends Component {

  constructor(props) {
      super(props);
      this.state = {newNoteValue: '', searchTerm: ''};

      this.addStarAction = this.addStarAction.bind(this);
      this.displayStar = this.displayStar.bind(this);
      this.handleNewNoteChange = this.handleNewNoteChange.bind(this);
      this.handleNewNoteSubmit = this.handleNewNoteSubmit.bind(this);
      this.onSearchBarChange = this.onSearchBarChange.bind(this);
      this.onSearchBarSubmit = this.onSearchBarSubmit.bind(this);
  }


  displayStar(star) {
      return <SingleStarView star={star}/>;
  }


    displayStars() {
        return (
            <ul className="nav nav-tabs">
                { _.map(this.formattedStars, (star) => {
                    return <li key={star['_id']} className="active nav-item"><a className="nav-link" data-toggle="pill" href={'#' + star.data}>{star.data}</a></li>
                })}
            </ul>
        )
    }

  handleNewNoteChange(event) {
    this.setState({newNoteValue: event.target.value});
  }

  handleNewNoteSubmit(event, star) {
    event.preventDefault();
    const newIndex = (this.getLargestIndexWithParentId(this.props.star, star.id) + 1) / 2;
    this.props.addStar(star.id, this.state.newNoteValue, newIndex);
    this.setState({newNoteValue: ""});
  }

  displayChildStars() {
    let first = true;
    return (
      <div className="tab-content">
      {_.map(this.formattedStars, (star) => {
        const result =  (
          <div key={star['_id']} id={star.data} className={ "form-group tab-pane fade in" + (first && "active") }>
            {this.displayStarsFull(star.childStars, star)}
            <hr className="col-xs-12" />
              <form onSubmit={(event) => this.handleNewNoteSubmit(event, star)}>
                <div className="row mt-5">
                  <div className="input-group col-12">
                    <input className="form-control" placeholder="New Note" value={this.state.newNoteValue} onChange={this.handleNewNoteChange} type="text"/>
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">
                        <i className="fa fa-plus" aria-hidden="true"></i> Add
                      </button>
                    </div>
                </div>
            </div>
              </form>
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

  displayStarsFull(items, parentStar) {
    console.log("Before nestable", {items}, {parentStar});
    const parentIdHappy = parentStar.id;
    return (
      <Nestable
        ref={(child) => {  }}
        items={items}
        childrenProp = "childStars"
        renderItem={(item)=> this.displayStar(item.item)}
        onChange={(items, updatedItem) => {
            //passing in undefined to identify when the item is on the base (outermost) level
          let newParentOfMovedStar = this.findInNestable(updatedItem, items, undefined);
          let lowerNeighbor = 0;
          let upperNeighbor = 1;

          if (!newParentOfMovedStar) {
            newParentOfMovedStar = {
              childStars: items,
              id: parentIdHappy
            };
          }
          let siblingStars = newParentOfMovedStar.childStars;

          for (let i = 0; i < siblingStars.length; i++) {
            if (siblingStars[i].id === updatedItem.id) {
              if (i < siblingStars.length - 1) {
                upperNeighbor = siblingStars[i+1].index;
              }
              break;
            }
            lowerNeighbor = siblingStars[i].index;
          }

          const newIndex = (lowerNeighbor + upperNeighbor) / 2;
          const update = {
              "parentId": newParentOfMovedStar.id,
              "index": newIndex,
              "data" : updatedItem.data
          }
          this.props.updateStar(updatedItem.id, update);
        }}
      />
    )
  }

  findInNestable(item, items, parent) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        return parent;
      }

      const result = this.findInNestable(item, items[i].childStars, items[i]);
      if (result) {
        return result;
      }
    }
  }

  displayAllStars() {
    return (
      <div>
          {this.displayStars()}
          {this.displayChildStars()}
      </div>
    )
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
    return largestIndex;
  }

  addStarAction() {
    var d = new Date();
    const notesStarId = this.getStarWithData(this.props.star, 'Stars')['_id'];

    const index = (this.getLargestIndexWithParentId(this.props.star, notesStarId) + 1) / 2;
    this.props.addStar(notesStarId, d.getHours() + ":" + d.getMinutes() +":"+ d.getSeconds(), index);
  }

  displaySyncStatus() {
    if (_.isEmpty(this.props.sync)) {
      return (
        <div>
          <span className="badge badge-pill badge-success">Synced</span>
        </div>
      );
    } else {
      return (
        <div>
          <span className="badge badge-pill badge-danger">Changes Made</span>
        </div>
      );
    }
  }

  onSearchBarChange(e) {
    this.setState({ searchTerm: e.target.value })
  }

  onSearchBarSubmit(e) {
    // this.setState({ searchTerm: e.target.value })
    e.preventDefault();
    this.search(this.props.star, this.state.searchTerm);
  }

  addSearchBar() {
    return (
      <form onSubmit={this.onSearchBarSubmit}>
        <input className="form-control" value={this.state.searchTerm} onChange={(e)=>{this.onSearchBarChange(e)}} />
      </form>
    )
  }

  render() {
    if (this.props.star && this.props.auth) {
      // this.search(this.props.star);
      // console.log("Formating");
      // console.log(formatStars(this.props.auth["_id"], this.props.star));
      // this.formattedStars = formatStars(this.props.auth["_id"], this.props.star)
      this.formattedStars = searchAndFormatStars(this.state.searchTerm, this.props.star, this.props.auth["_id"]);//formatStars(this.props.auth['_id'], this.search(this.props.star, this.state.searchTerm));
      return (
        <div>
          {this.displayAllStars()}
          <button className="btn btn-success" onClick={this.addStarAction}><i className="fa fa-plus"></i> Note</button>
          {this.displaySyncStatus()}
          {this.addSearchBar()}
        </div>
      )
    }
    else {
      return (
        <div>Loading ...</div>
      )
    }
  }
}

function mapStateToProps({ auth, star, sync }) {
  return { auth, star, sync };
}

export default connect(mapStateToProps, actions)(StarView);
