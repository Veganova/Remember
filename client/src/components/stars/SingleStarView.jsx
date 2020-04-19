import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/starActions';
import {changeFocus} from "../../actions/globalActions";
import '../styles/SingleStarView.scss';
import TextareaAutosize from 'react-textarea-autosize';

class SingleStarView extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.focusInput();
  }

  componentDidUpdate() {
    this.focusInput();
  }

  focusInput = () => {
    if (this.props.focus === this.props.star._id) {
      console.log("asdfasdfsadfdsf", this.props.star._id);
      this.textArea.focus();
      this.props.changeFocus(null);
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.props.onAddNewNote(this.props.star.parentId, this.props.star._id, this.props.star.next)(e, "");
    }
  };

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
    this.props.onEdit(star._id, {data});
  }

  renderInput() {
    const star = this.props.star;
    let prev, next, id, parentId;
    parentId = star.parentId.substring(star.parentId.length - 4, star.parentId.length);
    prev = star.prev ? star.prev.substring(star.prev.length - 4, star.prev.length) : 'null';
    next = star.next ? star.next.substring(star.next.length - 4, star.next.length) : 'null';
    id = star._id.substring(star._id.length - 4, star._id.length);
    const meta = prev && next && id ? parentId + ' | ' +  prev + " ... " + id + " ... " + next + " ... " : "";

    return (
        <TextareaAutosize className="star-input"
                  inputRef={(input) => this.textArea = input}
                  onChange={(e) => this.handleNoteEditChange(e, star)}
                  value={meta + star.data}
                  onKeyPress={this.handleKeyPress}
                  onKeyDown={this.handleKeyUp}
                  // onBlur={() => this.props.selected(null)}
                  maxRows={3}
        />
    );
  }

  render() {
    return (
        <div className="note">
          {this.renderInput()}
          <span className="star-remove">
            <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.onRemove(this.props.star._id)}/>
          </span>
        </div>
    );
  }
}

function mapStateToProps({focus}) {
  return {focus};
}

export default connect(mapStateToProps, {...actions, changeFocus})(SingleStarView);
