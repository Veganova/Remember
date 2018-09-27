import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import '../styles/SingleStarView.css';

class SingleStarView extends Component {

  constructor(props) {
    super(props);

    this.handleNoteEditSubmit = this.handleNoteEditSubmit.bind(this);
    this.handleNoteEditChange = this.handleNoteEditChange.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.doneTyping = this.doneTyping.bind(this);

    this.updateStar = _.debounce(this.props.editStar, 500);

    this.doneTypingUpdate = 1500;
    this.typingTimer;
  }

  componentDidMount() {
    if (this.props.star.focus) {
      this.textInput.focus();
      this.props.clearFocus();
    }
  }

  componentDidUpdate() {
    if (this.props.star.focus) {
      this.textInput.focus();
      this.props.clearFocus();
    }
  }

  doneTyping() {
    const star = this.props.star;
    this.props.updateStar(star.id, star.data);
  }

  handleNoteEditSubmit(event) {
    event.preventDefault();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const nextStarIndex = this.props.getNextStarIndex(this.props.star);
      const newIndex = (this.props.star.index + nextStarIndex) / 2;
      this.props.addStar(this.props.star.parentId, "", newIndex);
    }

  }

  handleKeyUp(e) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(this.doneTyping, this.doneTypingUpdate);

    if (e.keyCode === 8) {
      if (this.props.star.data === '') {
        this.props.removeStar(this.props.star.id);
      }
    } else if (e.keyCode === 38) {
      // UP arrow
      // simulate shift-tab
    } else if (e.keyCode === 40) {
      // DOWN arrow
      // simulate tab
    }
  }


  handleNoteEditChange(event, star) {
    const data = event.target.value;

    // Need to update locally. Fuse seems to break when this.state is used in the input instead of this.props.
    // Unsure why but consitently broke the search switching to state. thus using redux to populate this.props.star on keytype.
    this.props.updateLocalStar(star, data);
    this.updateStar(star.id, { data });
  }

  // set this on <input> for Nestable to no longer be able to drag by input onMouseDown={this.onClickHandler}
  onClickHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    const star = this.props.star;
    return (
      <form onSubmit={this.handleNoteEditSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="star-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fa fa-dot-circle-o"/></span>
              </div>
              <input className="form-control star-input"
                     ref = {(input) => { this.textInput = input; }}
                     onChange={(e) => this.handleNoteEditChange(e, star)}
                     type="text"
                     value={star.data}
                     onKeyPress={this.handleKeyPress}
                     onKeyDown={this.handleKeyUp}

              />
              <div className="input-group-append">
                  <span className="input-group-text star-remove">
                    <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.removeStar(star.id)}/>
                  </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

//
// export default ({star}) => {
//     return star.data;
// }

export default connect(null, actions)(SingleStarView);
