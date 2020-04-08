import React, {Component} from 'react';
import { Tab } from 'react-tabs';
import { connect } from 'react-redux'
import * as actions from "../../actions/starActions";

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
    return starName !== ""
        && starName !== "Notes"
        && starName !== "Trash";
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.validTabName(this.state.val)) {
      this.props.addStar(this.props.auth['_id'], this.state.val, this.props.prevId, "");

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

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(NewTab);