import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import '../styles/SingleStarView.css';

class SingleStarView extends Component {

    constructor(props) {
        super(props);

        this.handleNoteEditSubmit = this.handleNoteEditSubmit.bind(this);
        this.handleNoteEditChange = this.handleNoteEditChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.updateStar = _.debounce(this.props.updateStar , 500);

    }

    handleNoteEditSubmit(event) {
        event.preventDefault();
    }


    handleNoteEditChange(event, star) {
        const data = event.target.value;

        // Need to update locally. Fuse seems to break when this.state is used in the input instead of this.props.
      // Unsure why but consitently broke the search switching to state. thus using redux to populate this.props.star on keytype.
        this.props.updateLocalStar(star, data);
        this.updateStar(star.id, { data });
    }

    onClickHandler(event) {
        event.stopPropagation();
    }

    render() {
        const star = this.props.star;

        return (
            <form onSubmit={ this.handleNoteEditSubmit }>
                <div className="row">
                    <div className="col-12">
                        <div className="star-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fa fa-dot-circle-o"/></span>
                            </div>
                            <input className="form-control star-input" onChange={(e) => this.handleNoteEditChange(e, star) } type="text" value={star.data} />
                            <div className="input-group-append">
                              <span className="input-group-text star-remove">
                                <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.removeStar(star.id)}/>
                              </span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
//
// export default ({star}) => {
//     return star.data;
// }

export default connect(null, actions)(SingleStarView);
