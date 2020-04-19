import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import React from 'react';
import "../styles/NoteSectionTabs.scss";
import {connect} from "react-redux";
import {changeFocus} from "../../actions/globalActions";


const getItemStyle = (isDragging, draggableStyle, isSelected) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isSelected && "#BDBDBD",
    color: isSelected && "#1C1D1D",
    fontWeight: isSelected && 900,
    ...draggableStyle,
  }
};

const getListStyle = isDraggingOver => ({});

class NoteSectionTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
  }

  componentDidMount() {
    console.log(this.noteSection)
  }

  getStyles = (isDragging) => {
    const width = '125px';
    return {
      width: width,
      minWidth:  ((isDragging || this.state.hover || this.props.isSelected) ? (this.noteSection ? this.noteSection.scrollWidth : width) : width)
    };
  }

  render() {
    const {onSectionSelect, star, index, isSelected} = this.props;
    return (
        <Draggable draggableId={star._id} index={index}>
          {(provided, snapshot) => {
            return (
                <div
                    className="note-tab"
                    ref={(e) => {
                      this.noteSection = e;
                      provided.innerRef(e);
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...getItemStyle(snapshot.isDragging, provided.draggableProps.style, isSelected),
                      ...this.getStyles(snapshot.isDragging)
                    }}
                    onClick={() => onSectionSelect(star._id, index)}
                    onMouseEnter={() => this.setState({hover: true})}
                    onMouseLeave={() => this.setState({hover: false})}
                >
                  <span>{star.data}</span>
                </div>
            )
          }}
        </Draggable>
    )
  }
}


class NoteSections extends React.Component {
  handleDragEnd = ({source, destination}) => {
    if (!destination || source.index === destination.index) {
      return;
    }

    console.log("ENDED", source, destination);
    const movingStar = this.props.starSections[source.index];
    // calculate new neighbors
    const movedTo = destination.index;
    let prevId, nextId;
    if (movedTo === 0) {
      // Added to beginning of list
      prevId = null;
      nextId = this.props.starSections[0]._id;
    } else if (movedTo === this.props.starSections.length - 1) {
      // moved to last element
      prevId = this.props.starSections[this.props.starSections.length - 1]._id;
      nextId = null;
    } else {
      if (source.index > destination.index) {
        prevId = this.props.starSections[destination.index - 1]._id;
        nextId = this.props.starSections[destination.index]._id;
      } else {
        prevId = this.props.starSections[destination.index]._id;
        nextId = this.props.starSections[destination.index + 1]._id;
      }
    }
    this.props.moveSection(movingStar._id, movingStar.parentId, prevId, nextId);
  };

  isNoteTabSelected = (tabId, index) => {
    if (tabId === this.props.focus) {
      this.props.changeFocus(null);
      this.props.onSectionSelect(tabId, index);
      return false;
    }
    return tabId === this.props.selectedSectionId;
  };

  render() {
    console.log(this.props.starSections);
    return (
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
                <div
                    className="note-tab-container"
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                >
                  {this.props.starSections.map((item, index) => {
                    return (
                        <NoteSectionTab
                            onSectionSelect={this.props.onSectionSelect}
                            key={item._id}
                            star={item}
                            index={index}
                            isSelected={this.isNoteTabSelected(item._id, index)}
                        />
                    )
                  })}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </DragDropContext>
    );
  }
}

function mapStateToProps({focus}) {
  return {focus};
}

export default connect(mapStateToProps, {changeFocus})(NoteSections);