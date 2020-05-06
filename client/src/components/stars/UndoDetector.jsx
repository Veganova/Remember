import React, {Component} from 'react';
import {connect} from 'react-redux'
import {undo, redo} from "../../actions/starActions";
class UndoDetector extends Component {

  componentWillMount(){
    document.addEventListener("keydown", this._handleUndoPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleUndoPress, false);
  }

  _handleUndoPress = event => {
    if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      const stack = this.props.changes.undoStack;
      if (stack.length > 0) {
        const undoChange = stack[stack.length-1];
        console.log("Trigger UNDO", undoChange);
        this.props.undo(undoChange);
      }
    } else if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      const stack = this.props.changes.redoStack;
      if (stack.length > 0) {
        const redoChange = stack[stack.length-1];
        console.log("Trigger REDO", redoChange);
        this.props.redo(redoChange);
      }
    }
  };

  // Component doesn't render anything. Is responsible for Detecting and triggering changes for undos.
  render () {
    return null
  }

}

function mapStateToProps({focus, changes}) {
  return {focus, changes};
}

export default connect(mapStateToProps, {undo, redo})(UndoDetector);
