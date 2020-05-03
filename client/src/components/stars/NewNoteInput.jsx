import React from 'react';
import TextareaAutosize from "react-textarea-autosize";

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

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.handleOnSubmit(e);
    }
  };

  handleOnSubmit = (event) => {
    if (this.props.onSubmit(event, this.state.newNoteValue)) {
      // submit was successful, clear out input field
      this.setState({newNoteValue: ""})
    }
  };

  render() {
    return (
        <div className="note">
          <TextareaAutosize className="star-input"
                            onChange={this.handleNewNoteChange}
                            value={this.state.newNoteValue}
                            onKeyPress={this.handleKeyPress}
                            maxRows={6}
                            placeholder={"Add a new note"}
          />
        </div>
    )
  }
}