import React, {Component} from 'react';
import { Tab } from 'react-tabs';
import { connect } from 'react-redux'
import {addPopup} from "../../actions/globalActions";
import {POPUP_TYPE} from "../general/Popup";

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
    if(this.validTabName(this.state.val)) {
      this.props.onNewNote(event, this.state.val);

      // Empty out input box
      this.setState({val: ''});
    }
  }

  handleChange(event) {
    this.setState({val: event.target.value});
  }

  render() {
    if (!this.state.adding) {
      return (
        <Tab onClick={(e) => this.setState({adding: true})}>
          <div>{"+"}</div>
        </Tab>
      );
    }
    return (
      <Tab>
        <form onSubmit={this.handleSubmit}>
              <input className="form-control py-2"
                     autoFocus
                     onBlur={(e) => {this.setState({adding: false})}}
                     placeholder="New tab"
                     value={this.state.val}
                     onChange={this.handleChange} />
        </form>
      </Tab>
    );
  }
}

export default connect(null, {addPopup})(NewTab);