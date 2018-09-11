import React, {Component} from 'react';

export default class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }


  handleChange(event) {
    this.props.onChange(event)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row row justify-content-end">
          <div className="input-group col-5">
            <input className="form-control py-2" placeholder="Search" value={this.props.searchTerm} onChange={this.handleChange} />
            <span className="input-group-append">
                <button className="btn btn-outline-secondary" type="button">
                    <i className="fa fa-search"></i>
                </button>
              </span>
          </div>
        </div>
      </form>
    );
  }
}
