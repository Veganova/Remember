import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {formatStars, getById, searchAndFormatStars} from '../../helpers';
import Nestable from 'react-nestable';
import SingleStarView from "./SingleStarView";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SearchBar from "./SearchBar";
import NewTab from "./NewTab";
import '../styles/StarView.css'
import '../styles/SearchBar.css';
import Logout from "./Logout";
import NewNoteInput from "./NewNoteInput";

class StarView extends Component {

  constructor(props) {
      super(props);
      this.nullStarId = -1;
      this.state = {searchTerm: '', tabIndex: 0, lastTabIndex: 0, selectedStar: this.nullStarId};

      this.displayStar = this.displayStar.bind(this);
      this.handleNewNoteSubmit = this.handleNewNoteSubmit.bind(this);
      this.onSearchBarChange = this.onSearchBarChange.bind(this);
      // this.getNextStarIndex = this.getNextStarIndex.bind(this);
      this.starSelected = this.starSelected.bind(this);
  }

  starSelected(star) {
    let starId = this.nullStarId;
    if (star) {
      starId = star.id
    }
    this.setState({selectedStar: starId})
  }

  displayStar(star) {
      return <SingleStarView star={ star }
                             isSelected={ star.id === this.state.selectedStar }
                             selected={ this.starSelected }/>;
  }

  displayRemove(star) {
    // Do note have delete option for the two default tabs
    if (star.data !== 'Trash' && star.data !== 'Notes') {
      return <i className="fa fa-times gray" aria-hidden="true" onClick={() => this.props.removeStar(star.id)}/>
    }
  }

  displayStars() {
    let prevId = "";
      return (
          <TabList>
              { _.map(this.formattedStars, (star) => {
                prevId = star.id;
                  return (
                    <Tab key={star.id}>
                      {star.data + " "}
                      {this.displayRemove(star)}
                    </Tab>
                  )
              })}
              <NewTab prevId={prevId}/>
          </TabList>
      )
    }


  handleNewNoteSubmit = star => (event, value) => {
    event.preventDefault();

    let length = star.childStars.length;
    let prev = "";
    if (length > 0) {
      prev = star.childStars[length - 1]['_id'];
    }
    console.log("abc", star);
    console.log("new submit", prev);
    this.props.addStar(star.id, value, prev, "");
  }

  displayChildStars() {
    return (
        <div className="single-tab">
      {_.map(this.formattedStars, (star) => {
        let d = {};
        if (star.addDisabled) {d = {'disabled': 'disabled'}}
        const result =  (
          <TabPanel className="form-group tab-pane" key={star['_id']} >
            {/* Displays the hierarchy of notes */}
            {this.displayStarsFull(star.childStars, star)}
            <hr className="col-xs-12"/>
              <fieldset {...d}>
                  <NewNoteInput onSubmit={this.handleNewNoteSubmit(star)} />
              </fieldset>
              <div>
                <div className="float-right">
                  <button className="btn btn-danger" onClick={()=> { this.props.removeChildren(star.id)} }>
                    <i className="fa fa-minus"></i>
                    Delete All
                  </button>
                </div>
            </div>
           </TabPanel>
                  )
         return result;
      })}
      </div>
    )
  }

  displayStarsFull(items, parentStar) {
    const parentIdHappy = parentStar.id;
    return (
      <Nestable
        ref={(child) => {  }}
        items={items}
        childrenProp = "childStars"
        renderItem={(item)=> this.displayStar(item.item)}
        onChange={(items, updatedItem) => {
          // passing in undefined to identify when the item is on the base (outermost) level
          let newParentOfMovedStar = this.findInNestable(updatedItem, items, undefined);
          let lowerNeighbor = "";
          let upperNeighbor = "";

          // parent is top level star
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
                upperNeighbor = siblingStars[i+1];
              }
              break;
            }
            lowerNeighbor = siblingStars[i];
          }
          let byId = getById(this.state.stars);
          // temporary update locally
          // byId[updatedItem.prev].next = updatedItem.next;
          // byId[updatedItem.next].prev = updatedItem.prev;
          //
          // lowerNeighbor.next = updatedItem.id;
          // upperNeighbor.prev = updatedItem.id;
          //
          // updatedItem.prev = lowerNeighbor.id;
          // updatedItem.next = upperNeighbor.id;

          // updated database
          this.props.move(updatedItem.id, lowerNeighbor, upperNeighbor);
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

  // getNextStarIndex(star) {
  //   const parent = this.findInNestable(star, this.formattedStars, undefined);
  //
  //   for (let i = 0; i < parent.childStars.length; i++) {
  //     // return first index found greater than provided star's index
  //     if (parent.childStars[i].index > star.index) {
  //       return parent.childStars[i].index;
  //     }
  //   }
  //   return 1;
  // }

  displayAllStars() {
    let index = this.state.tabIndex;
    return (
      <div className="">
        <Tabs selectedIndex={index} onSelect={tabIndex => this.setState({ tabIndex, lastTabIndex: tabIndex })}>
          {this.displayStars()}
          {this.displayChildStars()}
        </Tabs>
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

  displaySyncStatus() {
    if (_.isEmpty(this.props.sync)) {
      return (
        <div className="">
          <span className="badge badge-pill badge-success synced">Synced</span>
        </div>
      );
    } else {
      return (
        <div className="">
          <span className="badge badge-pill badge-danger synced">Changes Made</span>
        </div>
      );
    }
  }

  onSearchBarChange(e) {
    let searchTerm = e.target.value;
    if (!searchTerm) {
      this.setState({ searchTerm, tabIndex: this.state.lastTabIndex})
    } else {
      let diff = 0;
      if (this.state.searchTerm) {
        // already have a tab for it
        diff = 1
      }
      this.setState({ searchTerm, tabIndex: this.formattedStars.length - diff })
    }
  }

  addSearchBar() {
    return (
      <SearchBar searchTerm={this.state.searchTerm} onChange={this.onSearchBarChange}/>
    )
  }

  render() {
    if (this.props.star && this.props.auth) {
      this.formattedStars = [];
      if (!this.state.searchTerm) {
        this.formattedStars = formatStars(this.props.auth["_id"], this.props.star);
      } else {
        this.formattedStars = searchAndFormatStars(this.state.searchTerm, this.props.star, this.props.auth["_id"]);//formatStars(this.props.auth['_id'], this.search(this.props.star, this.state.searchTerm));
      }
      return (
        <div className="container-fluid">
          <Logout />
          {this.addSearchBar()}
          {this.displayAllStars()}
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
}

function mapStateToProps({ auth, star, sync }) {
  return { auth, star, sync };
}

export default connect(mapStateToProps, actions)(StarView);
