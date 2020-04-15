import React from 'react';

export default class NewNoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newNoteValue: ""
    }
  }

  handleNewNoteChange = (event) => {
    this.setState({newNoteValue: event.target.value});
  };

  handleOnSubmit = (event) => {
    if (this.props.onSubmit(event, this.state.newNoteValue)) {
      // submit was successful, clear out input field
      this.setState({newNoteValue: ""})
    }
  };

  render() {
    return (
        <form onSubmit={this.handleOnSubmit}>
          <div className="row search-bar-container-space">
            <div className="input-group col-12">
              <input
                  className="form-control search-bar"
                  placeholder="New Note"
                  value={this.state.newNoteValue}
                  onChange={this.handleNewNoteChange}
                  type="text"
              />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="submit">
                  <i className="fa fa-plus" aria-hidden="true"/> Add
                </button>
              </div>
            </div>
          </div>
        </form>
    )
  }
}