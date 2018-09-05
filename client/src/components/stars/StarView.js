import _ from 'lodash';
import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { formatStars } from '../../helpers';
import Nestable from 'react-nestable';
import SingleStarView from "./SingleStarView";

class StarView extends Component {

  constructor(props) {
      super(props);
      this.state = {newNoteValue: '', syncStatus: 0};

      this.addStarAction = this.addStarAction.bind(this);
      this.displayStar = this.displayStar.bind(this);
      this.handleNewNoteChange = this.handleNewNoteChange.bind(this);
      this.handleNewNoteSubmit = this.handleNewNoteSubmit.bind(this);
      this.setSyncStatus = this.setSyncStatus.bind(this)
  }


  displayStar(star) {
      return <SingleStarView star={star} setSyncStatus={this.setSyncStatus}/>;
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
    this.setSyncStatus(1);
    this.setState({newNoteValue: event.target.value});
  }

  handleNewNoteSubmit(event, star) {
    this.setSyncStatus(2);
    event.preventDefault();
    const newIndex = (this.getLargestIndexWithParentId(this.props.star, star.id) + 1) / 2;
    this.props.addStar(star.id, this.state.newNoteValue, newIndex);
    this.setState({newNoteValue: ""});
    this.setSyncStatus(0);
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
        );
         first = false;
         return result;
      })}
      </div>
    )
  }

// state -> this.formattedStars.
// good for it to be global so that add can know where to add.. (but this is temporary.. can just loop over state )
// try updating state and have that rerender with all the correct data...
  displayStarsFull(items, parentStar) {
    const parentIdHappy = parentStar.id;
    return (
      <Nestable
        ref={(child) => {  }}
        items={items}
        childrenProp = "childStars"
        renderItem={(item)=> this.displayStar(item.item)}
        onChange={(items, updatedItem) => {
          this.setSyncStatus(2);
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
          };
          this.props.updateStar(updatedItem.id, update);
          this.setSyncStatus(0);
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

  displaySyncStatus() {
    switch (this.state.syncStatus) {
      case 0:
        return (
          <div>
            <span className="badge badge-pill badge-success">Synced</span>
          </div>
          );
      case 1:
        return (
          <div>
           <span className="badge badge-pill badge-danger">Changes Made</span>
          </div>
        );
      case 2:
        return (
          <div>
            <span className="badge badge-pill badge-warning">Saving...</span>
          </div>
        );
      default:
    }
  }

  setSyncStatus(syncStatus) {
    this.setState({ syncStatus })
  }

  render() {
    if (this.props.star && this.props.auth) {
        this.formattedStars = formatStars(this.props.auth['_id'], this.props.star);
      return (
          <div>
            {this.displayAllStars()}
            <button className="btn btn-success" onClick={this.addStarAction}><i className="fa fa-plus"></i> Note</button>
            {this.displaySyncStatus()}
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
    return largestIndex;
  }

  addStarAction() {
    this.setSyncStatus(2);
    var d = new Date();
    const notesStarId = this.getStarWithData(this.props.star, 'Stars')['_id'];

    const index = (this.getLargestIndexWithParentId(this.props.star, notesStarId) + 1) / 2;
    this.props.addStar(notesStarId, d.getHours() + ":" + d.getMinutes() +":"+ d.getSeconds(), index);
    this.setSyncStatus(0);
  }
}

function mapStateToProps({ auth, star }) {
  return { auth, star };
}

export default connect(mapStateToProps, actions)(StarView);
