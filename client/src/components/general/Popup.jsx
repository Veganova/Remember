import {connect} from 'react-redux';
import {addPopup, removePopup} from "../../actions/globalActions";
import React from 'react';
import '../styles/Popup.scss';
import {XIcon} from "./Common";


class Popup extends React.Component {
  _getTypeClass = (type) => {
    switch (type) {
      case POPUP_TYPE.ERROR:
        return "popupRed";
      case POPUP_TYPE.WARNING:
        return "popupOrange";
      case POPUP_TYPE.INFO:
        return "popupGray";
      default:
        throw `${type} is not a valid popUpType`;
    }
  }

  //TODO  http://reactcommunity.org/react-transition-group/transition
  render () {
    const {popupType, message, count} = this.props;
    const typeClass = this._getTypeClass(popupType);
    const renderedCount = count > 1 && <span className="popupCount">{count}</span>;
    return (
        <div className="popupIndividual">
          <div className={`popup  ${typeClass}`}>
            {renderedCount}
            {message}
            <XIcon onClick={() => this.props.handleOnRemove()} />
          </div>
        </div>
    );
  }
}


class PopupList extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.popups.length < this.props.popups.length) {
      // New popup added
      for (let newPopupIndex = prevProps.popups.length; newPopupIndex < this.props.popups.length; newPopupIndex++) {
        const removalPopup = this.props.popups[newPopupIndex]
        setTimeout(() => this.props.removePopup(removalPopup), 8000);
      }
    }
  }

  renderSinglePopup = (popup, index) => {
    const {popupType, message, count} = popup;
    return <Popup key={index} popupType={popupType} message={message} count={count} handleOnRemove={() => this.props.removePopup(popup)}/>;
  };

  render() {
    if (this.props.popups.length === 0) {
      return null;
    }

    return (
        <div className="popupContainer">
          {this.props.popups.map(this.renderSinglePopup)}
        </div>
    );
  }
}

export const POPUP_TYPE = {
  ERROR: 1,
  WARNING: 2,
  INFO: 3
};

function mapStateToProps({popups}) {
  return {popups};
}

export default connect(mapStateToProps, {removePopup})(PopupList);