import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class StarView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            noteData: this.props.star.data
        };

        this.handleNoteEditSubmit = this.handleNoteEditSubmit.bind(this);
        this.handleNoteEditChange = this.handleNoteEditChange.bind(this);
    }

    handleNoteEditSubmit(event, star) {
        event.preventDefault();
        // this.props.updateStar(star.id, {"data": this.state.noteData});
    }

    handleNoteEditChange(event) {
        this.setState({noteData: event.target.value});
    }

    render() {
        const star = this.props.star;
        return (
            <form onSubmit={(e)=> this.handleNoteEditSubmit(e, star)}>
                <div className="row">
                    <div className="input-group col-12">
                        <div className="input-group-prepend">
                            <span className="input-group-text">{star.index}</span>
                        </div>
                        <input className="form-control" onChange={this.handleNoteEditChange} type="text" value={this.state.noteData} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" onClick={() => this.props.removeStar(star.id)} type="button">
                                <i className="fa fa-times" aria-hidden="true"/> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default connect(null, actions)(StarView);
