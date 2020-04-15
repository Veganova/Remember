import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/starActions';
import {changeFocus} from "../../actions/globalActions";
import '../styles/SingleStarView.scss';

class SingleStarView extends Component {

  constructor(props) {
    super(props);

    this.clicks = 0;
  }

  componentDidMount() {
    this.focusInput()
  }

  componentDidUpdate() {
    this.focusInput()
  }

  focusInput = () => {
    if (this.props.focus === this.props.star._id) {
      this.textInput.focus();
      this.props.changeFocus(null);
    }
  }

  handleNoteEditSubmit = (event) => {
    event.preventDefault();
    console.log("submitted singlestarview form")
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onAddNewNote(this.props.star.parentId, this.props.star._id, this.props.star.next)(e, "");
    }
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 8) {
      if (this.props.star.data === '') {
        this.props.onRemove(this.props.star._id);
      }
    } else if (e.keyCode === 38) {
      // UP arrow
      // simulate shift-tab
    } else if (e.kCode === 40) {
      // DOWN arrow
      // simulate tab
    }
  }


  handleNoteEditChange = (event, star) => {
    const data = event.target.value;

    // Need to update locally. Fuse seems to break when this.state is used in the input instead of this.props.
    // Unsure why but consitently broke the search switching to state. thus using redux to populate this.props.star on keytype.
    console.log(data);
    this.props.onEdit(star._id, {data});
  }

  // set this on <input> for Nestable to no longer be able to drag by input onMouseDown={this.onClickHandler}

  onClickHandler = () => {
    let resetClick = () => {
      this.clicks = 0
    }
    this.clicks += 1;
    if (this.clicks >= 2) {
      resetClick()
      this.props.selected(this.props.star);
    } else {
      // first click has occurred, see if user clicks again quickly. If they don't, reset click count
      this.clickTimeout = setTimeout(() => {
        resetClick()
      }, 300);
    }
  }

  renderInput() {
    const star = this.props.star;
    let prev, next, id, parentId;
    // parentId = star.parentId.substring(star.parentId.length - 4, star.parentId.length);
    // prev = star.prev ? star.prev.substring(star.prev.length - 4, star.prev.length) : 'null';
    // next = star.next ? star.next.substring(star.next.length - 4, star.next.length) : 'null';
    // id = star._id.substring(star._id.length - 4, star._id.length);
    const meta = prev && next && id ? parentId + ' | ' +  prev + " ... " + id + " ... " + next + " ... " : "";

    if (this.props.isSelected) {
      return (
        <textarea className="form-control star-input"
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  onChange={(e) => this.handleNoteEditChange(e, star)}
                  value={meta + star.data}
                  onKeyPress={this.handleKeyPress}
                  onKeyDown={this.handleKeyUp}
                  onBlur={() => this.props.selected(null)}
        />)
    } else {
      return (
        <input className="form-control star-input"
               ref={(input) => {
                 this.textInput = input;
               }}
               onChange={(e) => this.handleNoteEditChange(e, star)}
               type="text"
               value={meta + star.data}
               onKeyPress={this.handleKeyPress}
               onKeyDown={this.handleKeyUp}
               onClick={this.onClickHandler}
          // onFocus={() => this.props.selected(this.props.star)}
        />);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleNoteEditSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="star-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fa fa-dot-circle-o"/></span>
              </div>
              {this.renderInput()}
              <div className="input-group-append">
                  <span className="input-group-text star-remove">
                    <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.onRemove(this.props.star._id)}/>
                  </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

function mapStateToProps({focus}) {
  return {focus};
}

export default connect(mapStateToProps, {...actions, changeFocus})(SingleStarView);
