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
    }

    handleNoteEditSubmit(event, star) {
        event.preventDefault();
        this.props.updateStar(star.id, {"data": star.data});
    }


    handleNoteEditChange(event) {
        this.props.updateLocalStar(this.props.star, event.target.value)
    }

    onClickHandler(event) {
        event.stopPropagation();
    }

    render() {
        const star = this.props.star;
        return (
            <form onSubmit={(e)=> this.handleNoteEditSubmit(e, star)}>
                <div className="row">
                    <div className="col-12">
                        <div className="star-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fa fa-dot-circle-o"/></span>
                            </div>
                            <input className="form-control star-input" onChange={this.handleNoteEditChange} type="text" value={star.data} />
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
