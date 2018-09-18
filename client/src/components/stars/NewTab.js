import React, {Component} from 'react';
import { Tab } from 'react-tabs';

export default class NewTab extends Component {

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
              <input className="form-control py-2" placeholder="Search" value={this.props.searchTerm} onChange={this.handleChange} />
        </form>
      </Tab>
    );
  }
}
