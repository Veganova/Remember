import React, {Component} from 'react';
import {Tab} from 'react-tabs';
import {connect} from 'react-redux'
import {addPopup} from "../../actions/globalActions";
import {POPUP_TYPE} from "../general/Popup";
import {XIcon} from "../general/Common";

class NewTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "adding": false,
      "val": ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  validTabName(starName) {
    if (starName === "") {
      this.props.addPopup("Empty Input - Tab name cannot be empty", POPUP_TYPE.WARNING);
      return false;
    }
    if (starName === "Notes" || starName === "Trash") {
      this.props.addPopup("Conflicting name - Tab name cannot be 'Notes' or 'Trash'", POPUP_TYPE.WARNING);
      return false;
    }
    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validTabName(this.state.val)) {
      this.props.onNewNote(event, this.state.val);

      // Empty out input box
      this.setState({val: '', adding: false});
    }
  }

  handleChange(event) {
    this.setState({val: event.target.value});
  }

  renderAddButton = () => {
    return (
        <div className="add-tab-button-wrapper" onClick={() => this.setState({adding: true})}>
          <div className="add-tab-button">+</div>
        </div>
    )
  }

  renderAddNewTab = () => {
    return (
        <div className="add-tab-input-wrapper">
          <div className="note note-tab">
            <form onSubmit={this.handleSubmit}>
              <input className="star-input"
                     autoFocus
                     onBlur={(e) => this.setState({adding: false})}
                     placeholder="New tab"
                     value={this.state.val}
                     onChange={this.handleChange}/>
            </form>
          </div>
        </div>
    );
  }

  render() {
    return (
        <div className="add-tab">
          {this.state.adding ? this.renderAddNewTab() : this.renderAddButton()}
        </div>
    )
  }
}

export default connect(null, {addPopup})(NewTab);