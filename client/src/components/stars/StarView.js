import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {formatStars, searchAndFormatStars} from '../../helpers';
import Nestable from 'react-nestable';
import SingleStarView from "./SingleStarView";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SearchBar from "./SearchBar";
import NewTab from "./NewTab";
import '../styles/StarView.css'
import '../styles/SearchBar.css';
import Logout from "./Logout";

class StarView extends Component {

  constructor(props) {
      super(props);
      this.state = {newNoteValue: '', searchTerm: '', tabIndex: 0, lastTabIndex: 0};

      this.displayStar = this.displayStar.bind(this);
      this.handleNewNoteChange = this.handleNewNoteChange.bind(this);
      this.handleNewNoteSubmit = this.handleNewNoteSubmit.bind(this);
      this.onSearchBarChange = this.onSearchBarChange.bind(this);
  }


  displayStar(star) {
      return <SingleStarView star={star}/>;
  }


  displayRemove(star) {
    // Do note have delete option for the two default tabs
    if (star.data !== 'Trash' && star.data !== 'Notes') {
      return <i className="fa fa-times gray" aria-hidden="true" onClick={() => this.props.removeStar(star.id)}/>
    }
  }

  displayStars() {
    let prevIndex = 0;
      return (
          <TabList>
              { _.map(this.formattedStars, (star) => {
                prevIndex = star.index;
                  return (
                    <Tab key={star.id}>{star.data + " "}
                      {this.displayRemove(star)}
                    </Tab>
                  )
              })}
              <NewTab prevIndex={prevIndex}/>
          </TabList>
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
    return (
        <div className="single-tab">
      {_.map(this.formattedStars, (star) => {
        let d = {};
        if (star.addDisabled) {d = {'disabled': 'disabled'}}
        const result =  (
          <TabPanel className="form-group tab-pane" key={star['_id']} >
            {this.displayStarsFull(star.childStars, star)}
            <hr className="col-xs-12"/>
              <form onSubmit={(event) => this.handleNewNoteSubmit(event, star)}>
                <fieldset {...d}>

                <div className="row search-bar-container-space">
                  <div className="input-group col-12">
                    <input className="form-control search-bar" placeholder="New Note" value={this.state.newNoteValue} onChange={this.handleNewNoteChange} type="text"/>
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">
                        <i className="fa fa-plus" aria-hidden="true"/> Add
                      </button>
                    </div>
                </div>
            </div>
                </fieldset>
              </form>
              <div>
                <div className="float-right">
                  <button className="btn btn-danger" onClick={()=> { this.props.removeChildren(star.id)} }><i className="fa fa-minus"></i> Delete All</button>
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
