import {connect} from 'react-redux';
import {addPopup, removePopup} from "../../actions/globalActions";
import React from 'react';
import '../styles/Popup.scss';


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

  render () {
    const {popupType, message} = this.props;
    const typeClass = this._getTypeClass(popupType);
    return (
        <div className="popupIndividual">
          <div className={`popup  ${typeClass}`}>
            {message}
            <svg onClick={() => this.props.handleOnRemove()}
                 className="bi bi-x" width="1.15em" height="1.15em" viewBox="0 0 16 16" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                    clipRule="evenodd"/>
              <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                    clipRule="evenodd"/>
            </svg>
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
        setTimeout(() => this.props.removePopup(removalPopup), 15000);
      }
    }
  }

  renderSinglePopup = (popup, index) => {
    const {popupType, message} = popup;
    return <Popup key={index} popupType={popupType} message={message} handleOnRemove={() => this.props.removePopup(popup)}/>;
  }

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