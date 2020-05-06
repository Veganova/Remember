import {UPDATE_LOCAL_STARS, UNDO, REDO, REGULAR_CHANGE} from '../actions/types'

export default function (changes = {
  undoStack: [],
  redoStack: []
}, action) {
  switch (action.type) {
    case UPDATE_LOCAL_STARS:
      const {changeType} = action.payload;

      if (changeType === REGULAR_CHANGE) {
        const newUndoStack = JSON.parse(JSON.stringify(changes.undoStack));
        newUndoStack.push(action.payload.changes);
        return {
          undoStack: newUndoStack,
          redoStack: []
        };
      } else if (changeType === UNDO) {
        const newUndoChanges = JSON.parse(JSON.stringify(changes));
        newUndoChanges.redoStack.push(
            newUndoChanges.undoStack.pop()
        );
        return newUndoChanges;
      } else if (changeType === REDO) {
        const newRedoChanges = JSON.parse(JSON.stringify(changes));
        newRedoChanges.undoStack.push(
            newRedoChanges.redoStack.pop()
        );
        return newRedoChanges;
      } else {
        throw "Unknown changeType " + changeType;
      }
    default:
      return changes;
  }
}
