import React, {Component} from 'react';
import {connect} from 'react-redux'
class UndoDetector extends Component {

  componentWillMount(){
    document.addEventListener("keydown", this._handleUndoPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleUndoPress, false);
  }

  _handleUndoPress = event => {
    if(this.props.focus === null && (event.ctrlKey || event.metaKey) && event.key === 'z') {
      console.log("Trigger UNDO", this.props.focus);
    }
  };

  // Component doesn't render anything. Is responsible for Detecting and triggering changes for undos.
  render () {
    return null
  }

}

function mapStateToProps({focus}) {
  return {focus};
}

export default connect(mapStateToProps, null)(UndoDetector);
