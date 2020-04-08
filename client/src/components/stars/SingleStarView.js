import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/starActions';
import '../styles/SingleStarView.scss';

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
    // this.typingTimer; this.clickTimeout;

    this.clicks = 0;
  }

  componentDidMount() {
    this.focusInput()
  }

  componentDidUpdate() {
    this.focusInput()
  }

  focusInput() {
    if (this.props.star.focus) {
      this.textInput.focus();
      this.props.clearFocus();
    }
    if (this.props.isSelected) {
      this.textInput.focus();
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
      // const nextStarIndex = this.props.getNextStarIndex(this.props.star);
      // const newIndex = (this.props.star.index + nextStarIndex) / 2;

      this.props.addStar(this.props.star.parentId, "", this.props.star.id, this.props.star.next);
    }

  }

  handleKeyUp(e) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(this.doneTyping, this.doneTypingUpdate);

    if (e.keyCode === 8) {
      if (this.props.star.data === '') {
        this.props.removeStar(this.props.stars, this.props.star.id);
      }
    } else if (e.keyCode === 38) {
      // UP arrow
      // simulate shift-tab
    } else if (e.kCode === 40) {
      // DOWN arrow
      // simulate tab
    }
  }


  handleNoteEditChange(event, star) {
    const data = event.target.value;

    // Need to update locally. Fuse seems to break when this.state is used in the input instead of this.props.
    // Unsure why but consitently broke the search switching to state. thus using redux to populate this.props.star on keytype.
    this.props.updateLocalStar(star, data);
    this.updateStar(star.id, {data});
  }

  // set this on <input> for Nestable to no longer be able to drag by input onMouseDown={this.onClickHandler}

  onClickHandler() {
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
    const prev = star.prev ? star.prev.substring(star.prev.length - 4, star.prev.length) : 'null';
    const next = star.next ? star.next.substring(star.next.length - 4, star.next.length) : 'null';
    const id = star.id.substring(star.id.length - 4, star.id.length);

    if (this.props.isSelected) {
      return (
        <textarea className="form-control star-input"
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  onChange={(e) => this.handleNoteEditChange(e, star)}
                  value={prev + " ... " + id + " ... " + next + " ... " + star.data}
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
               value={prev + " ... " + id + " ... " + next + " ... " + star.data}
               onKeyPress={this.handleKeyPress}
               onKeyDown={this.handleKeyUp}
               onClick={this.onClickHandler}
          // onFocus={() => this.props.selected(this.props.star)}
        />);
    }
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
              {this.renderInput()}
              <div className="input-group-append">
                  <span className="input-group-text star-remove">
                    <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.removeStar(this.props.stars, star.id)}/>
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
