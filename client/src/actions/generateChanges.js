import {getById} from "../helpers";
import _ from 'lodash';

// All methods should result in an object with current and changed versions the stars at hand
// { 'somestarid': {'operation': 'delete/add/update', 'current': {...}, 'changed': {...}}

//  ------------------------------ Helpers ----------------------------------------
const getTrashStar = (stars) => stars.find(star => star.data === 'Trash' && star.parentId === star.userId);

function* createIdGenerator() {
  let i = 0;
  while (true) {
    yield 'new_node_placeholder_' + String(i++)
  }
}

const generateId = createIdGenerator();

// Remove star from old neighbors and link old neighbors to be adjacent
const moveFirstPart = (stars, toMoveStar, byIdMap) => {
  byIdMap = byIdMap || getById(stars);
  const changes = {};
  if (toMoveStar.prev) {
    const prevStar = byIdMap[toMoveStar.prev];
    // Copy current version and store change
    changes[prevStar['_id']] = {
      operation: "update",
      current: prevStar,
      changed: {
        next: toMoveStar.next
      }
    };
  }
  if (toMoveStar.next) {
    const nextStar = byIdMap[toMoveStar.next];
    // Copy current version and store change
    changes[nextStar['_id']] = {
      operation: "update",
      current: nextStar,
      changed: {
        prev: toMoveStar.prev
      }
    };
  }

  return changes;
};

// Add star amongst new neighbors
// Usage:
// 1. Place by providing both prev and next
// 2. Place by only providing prev or next -> if prev=null, nextId is the id of the first node and vise versa.
// 3. Place by specifying neither.
//      prev=null, next=true means place as the first child under the given parentId.
//      next=null, prev=true means place as the last.
const moveSecondPart = (stars, toMoveStar, parentId, prevId, nextId, byIdMap) => {
  byIdMap = byIdMap || getById(stars);
  const moveStarId = toMoveStar['_id'];

  // Check links and fill in missing information
  if (!prevId && !nextId) {
    // Ensure that no children exist under parent
    if (stars.filter(star => star.parentId === parentId).length > 0) {
      throw "addStar given star without prev/next under a parent that has children " + JSON.stringify({
        toMoveStar,
        parentId,
        prevId,
        nextId
      });
    }
  } else if (!prevId && nextId === true) {
    nextId = null;
    // Place as first child node under parent. nextId must be set to the previous first child.
    const priorFirstChild = stars.find(star => star.parentId === parentId && !star.prev);
    if (priorFirstChild) {
      nextId = priorFirstChild['_id'];
    }
  } else if (!nextId && prevId === true) {
    prevId = null;
    // Place as last child node under parent
    const priorLastChild = stars.find(star => star.parentId === parentId && !star.next);
    if (priorLastChild) {
      prevId = priorLastChild['_id'];
    }
  }
  if (moveStarId === prevId || moveStarId === nextId) {
    throw "Invalid move operation, object is already located here: " + JSON.stringify(toMoveStar);
  }
  // Put toMoveStar in its new location
  const changes = {
    [moveStarId]: {
      operation: "update",
      current: toMoveStar,
      changed: {prev: null, next: null}
    }
  };
  if (prevId) {
    const prevStar = byIdMap[prevId];
    // Copy current version and store changes
    changes[prevId] = {
      operation: "update",
      current: prevStar,
      changed: {
        next: moveStarId
      }
    };
    changes[moveStarId]['changed']['prev'] = prevId;
  }
  if (nextId) {
    const nextStar = byIdMap[nextId];
    // Copy current version and store changes
    changes[nextId] = {
      operation: "update",
      current: nextStar,
      changed: {
        prev: moveStarId
      }
    };
    changes[moveStarId]['changed']['next'] = nextId;
  }
  changes[moveStarId]['changed']['parentId'] = parentId;
  return changes;
};


// ------------------- Main methods ----------------------------------
// Creates a temporary star object with a fake Id. Its sole purpose is to store information for the BE service to
// store. Passing this info will alleviate the BE from having to validate or compute prev/next links.
const getAddStarChanges = (stars, data, parentId, prevId, nextId, byIdMap = null) => {
  byIdMap = byIdMap || getById(stars);
  const star = {
    _id: generateId.next().value
  };
  const changes = moveSecondPart(stars, star, parentId, prevId, nextId, byIdMap);
  changes[star['_id']]['operation'] = 'add';
  changes[star['_id']]['current'] = null;
  changes[star['_id']]['changed']['data'] = data;
  return changes;
};

const getRemoveStarChanges = (stars, toRemoveStarId, byIdMap = null) => {
  byIdMap = byIdMap || getById(stars);
  const toRemoveStar = byIdMap[toRemoveStarId];
  const trashStar = getTrashStar(stars);
  let changes = {};
  if (toRemoveStar.parentId === trashStar['_id']) {
    // Already in trash, must delete
    changes = moveFirstPart(stars, toRemoveStar, byIdMap);
    changes[toRemoveStar['_id']] = {operation: 'delete', current: toRemoveStar};
  } else {
    // Add as first node in trash
    changes = getMoveStarChanges(stars, toRemoveStarId, trashStar['_id'], null, true, byIdMap);
  }

  return changes;
};

// Provide the star that is to be moved and its new parent/prev/next ids.
// Look at moveSecondPart() definition for more details
const getMoveStarChanges = (stars, toMoveStarId, parentId, prevId, nextId, byIdMap = null) => {
  byIdMap = byIdMap || getById(stars);
  const toMoveStar = byIdMap[toMoveStarId];
  // combine changes from both steps
  const changes = _.merge(
      moveFirstPart(stars, toMoveStar, byIdMap),
      moveSecondPart(stars, toMoveStar, parentId, prevId, nextId, byIdMap)
  );
  changes[toMoveStarId]['changed'].focus = true;
  return changes;
};

const getEditStarChanges = (stars, toEditStarId, edits, byIdMap = null) => {
  byIdMap = byIdMap || getById(stars);
  const toEditStar = byIdMap[toEditStarId];

  return {
    [toEditStarId]: {
      operation: "update",
      current: toEditStar,
      changed: {
        ...edits
      },
      // Mark change as 'simple' if provided edits only change the 'data' field.
      isSimpleEdit: (Object.keys(edits).length === 1 && "data" in edits)
    }
  }
}

export {getMoveStarChanges, getRemoveStarChanges, getAddStarChanges, getEditStarChanges};