import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as starActions from '../../actions/starActions';
import {POPUP_TYPE} from '../general/Popup';
import {addPopup} from "../../actions/globalActions";
import {formatStars, searchAndFormatStars} from '../../utils/helpers';
import Nestable from 'react-nestable';
import SingleStarView from "./SingleStarView";
import {Tab, TabList, Tabs} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SearchBar from "./SearchBar";
import NewTab from "./NewTab";
import '../styles/StarView.scss'
import '../styles/SearchBar.scss';
import Logout from "./Logout";
import NewNoteInput from "./NewNoteInput";
import NoteSectionsTabs from "./NoteSectionTabs";


class StarView extends Component {

  constructor(props) {
    super(props);
    this.state = {searchTerm: '', selectedSectionId: null, tabIndex: 0, lastTabIndex: 0};

    this.onSearchBarChange = this.onSearchBarChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.star && !this.state.selectedSectionId) {
      const firstTabSection = this.props.star.find(star => star.parentId === star.userId);
      this.setState({selectedSectionId: firstTabSection._id});
    }
  }


  displayStar = (star) => {
    return <SingleStarView
        stars={this.props.star}
        star={star}
        onAddNewNote={this.handleNewNoteSubmit}
        onRemove={this.removeStar}
        onEdit={this.editStar}
    />;
  }


  checkLock = (errorMessage = "Service operation ongoing, app is currently locked.") => {
    if (this.props.lock.length > 0) {
      console.warn(this.props.lock);
      this.props.addPopup(errorMessage, POPUP_TYPE.ERROR);
      return false;
    }
    return true;
  };

  handleNewNoteSubmit = (parentId, prev = true, next = null) => (event, value) => {
    event.preventDefault();

    if (this.checkLock(`Couldn't add note: ${value}`)) {
      this.props.addStar(this.props.star, value, parentId, prev, next);
    }
    return true;
  };

  moveStar = (starId, parentId, prevId, nextId) => {
    if (this.checkLock()) {
      this.props.moveStar(this.props.star, starId, parentId, prevId, nextId);
    }
  };


  editStar = (starId, edits) => {
    if (this.checkLock()) {
      this.props.editStar(this.props.star, starId, edits);
    }
  };

  removeStar = (starId) => {
    if (this.checkLock()) {
      this.props.removeStar(this.props.star, starId);
    }
  };

  removeChildren = (parentId) => {
    if (this.checkLock()) {
      // console.log(this.props.star.filter(star => star._id === parentId));
      this.props.removeChildren(this.props.star, parentId);
    }
  };

  displayRemove(star) {
    // Do note have delete option for the two default tabs
    const userId = this.props.auth["_id"]
    if (!(star.parentId === userId && (star.data === 'Trash' || star.data === 'Notes'))) {
      return <i className="fa fa-times gray" aria-hidden="true" onClick={() => this.removeStar(star._id)}/>
    }
  }

  displayStars() {
    let prevId = "";
    return (
        <TabList>
          {_.map(this.formattedStars, (star) => {
            prevId = star._id;
            return (
                <Tab key={star._id}>
                  {star.data + " "}
                  {this.displayRemove(star)}
                </Tab>
            )
          })}
          <NewTab prevId={prevId} onNewNote={this.handleNewNoteSubmit(this.props.auth._id)}/>
        </TabList>
    )
  }

  displayChildStars() {
    let star = this.formattedStars.find(formattedStar => formattedStar._id === this.state.selectedSectionId);
    star = star || this.formattedStars[0];
    let d = {};
    if (star.addDisabled) {
      d = {'disabled': 'disabled'}
    }
    return (
        <React.Fragment>
          {/* Displays the hierarchy of notes */}
          {this.displayStarsFull(star.childStars, star)}
          <hr className="col-xs-12"/>
          <fieldset {...d}>
            <NewNoteInput onSubmit={this.handleNewNoteSubmit(star._id)}/>
          </fieldset>
          <div>
            <div className="float-right">
              <button className="btn btn-danger" onClick={() => {
                this.removeChildren(star._id);
              }}>
                <i className="fa fa-minus"/>
                Delete All
              </button>
            </div>
          </div>
        </React.Fragment>
    );
  }

  displayStarsFull(items, parentStar) {
    const parentIdHappy = parentStar._id;
    return (
        <Nestable
            ref={(child) => {
            }}
            items={items}
            childrenProp="childStars"
            renderItem={(item) => this.displayStar(item.item)}
            onChange={(items, updatedItem) => {
              // passing in undefined to identify when the item is on the base (outermost) level
              let newParentOfMovedStar = this.findInNestable(updatedItem, items, undefined);
              let prevNeighbor = null;
              let nextNeighbor = null;

              // parent is top level star
              if (!newParentOfMovedStar) {
                newParentOfMovedStar = {
                  childStars: items,
                  _id: parentIdHappy
                };
              }

              let siblingStars = newParentOfMovedStar.childStars;

              for (let i = 0; i < siblingStars.length; i++) {
                if (siblingStars[i]._id === updatedItem._id) {
                  if (i < siblingStars.length - 1) {
                    nextNeighbor = siblingStars[i + 1]._id;
                  }
                  break;
                }
                prevNeighbor = siblingStars[i]._id;
              }

              // update database
              this.moveStar(updatedItem._id, newParentOfMovedStar._id, prevNeighbor, nextNeighbor);
            }}
        />
    )
  }

  findInNestable(item, items, parent) {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === item._id) {
        return parent;
      }

      const result = this.findInNestable(item, items[i].childStars, items[i]);
      if (result) {
        return result;
      }
    }
  }

  displayTabs = () => {
    console.log(this.formattedStars);
    const lastStarId = this.formattedStars[this.formattedStars.length - 1];
    return (
        <div className="top-note-bar">
          <NoteSectionsTabs
              starSections={this.formattedStars}
              moveSection={this.moveStar}
              onSectionSelect={(starId) => this.setState({selectedSectionId: starId})}
              selectedSectionId={this.state.selectedSectionId}
          />
          <NewTab prevId={lastStarId} onNewNote={this.handleNewNoteSubmit(this.props.auth._id)}/>
        </div>
    )
  }

  displayAllStars() {
    return (
        <div className="">
          {this.displayTabs()}
          {this.displayChildStars()}
        </div>
    )
  }

  displaySyncStatus() {
    return (
        <div className="">
          <span className="badge badge-pill badge-success synced">Synced</span>
        </div>
    );
    // TODO revisit when undo stack has been implemented.
    // if (_.isEmpty(this.props.sync)) {
    //   return (
    //       <div className="">
    //         <span className="badge badge-pill badge-success synced">Synced</span>
    //       </div>
    //   );
    // } else {
    //   return (
    //       <div className="">
    //         <span className="badge badge-pill badge-danger synced">Changes Made</span>
    //       </div>
    //   );
    // }
  }

  onSearchBarChange(e) {
    let searchTerm = e.target.value;
    if (!searchTerm) {
      this.setState({searchTerm, tabIndex: this.state.lastTabIndex})
    } else {
      let diff = 0;
      if (this.state.searchTerm) {
        // already have a tab for it
        diff = 1
      }
      this.setState({searchTerm, tabIndex: this.formattedStars.length - diff})
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
          <div className="entity-container container-fluid">
            <Logout/>
            {this.addSearchBar()}
            {this.displayAllStars()}
            {this.displaySyncStatus()}
          </div>
      )
    } else {
      return (
          <div>Loading ...</div>
      )
    }
  }
}

function mapStateToProps({auth, star, sync, lock}) {
  return {auth, star, sync, lock};
}

export default connect(mapStateToProps, {...starActions, addPopup})(StarView);
