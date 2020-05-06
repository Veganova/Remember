import {getById} from "./helpers";

function updateStarByChange(stars, targetStarId, change, byId) {
  console.log(change);
  if (change["operation"] === "update") {
    const targetStar = byId[targetStarId];
    let isSimpleEdit = false;
    for (const changedKey in change["changed"]) {
      targetStar[changedKey] = change["changed"][changedKey];
    }
    if (!isSimpleEdit) {
      // Delete and add to insert at the correct position.
      stars = deleteStar(stars, targetStarId);
      stars = addStar(stars, targetStar);
    }
  } else if (change["operation"] === "delete") {
    stars = deleteStar(stars, targetStarId);
  } else if (change["operation"] === "add") {
    if (!("saved" in change)) {
      // ID generation is left to backend. Will not create any stars locally
      throw 'Add operation not implemented for updating local state ' + JSON.stringify(change);
    }
    stars = addStar(stars, change["saved"]);
  } else {
    throw 'No such operation ' + JSON.stringify(change);
  }

  return stars;
}

function deleteStar(newState, removedStarId) {
  return newState.filter(star => removedStarId !== star['_id']);
}

// LinkSort single insert step
function addStar(newState, formattedStar) {
  // with no previous link, putting it at the front of the list is safe.
  if (formattedStar.prev === null) {
    newState.unshift(formattedStar);
    return newState;
  }
  for (let i = 0; i < newState.length; i++) {
    if (formattedStar.prev === newState[i]['_id']) {
      newState.splice(i + 1, 0, formattedStar);
      return newState;
    }
  }

  throw 'add star reducer did not add element to state';
}

const applyChanges = (stars, changes) => {
  const byId = getById(stars);
  for (let changedStarId in changes) {
    const change = changes[changedStarId];
    stars = updateStarByChange(stars, changedStarId, change, byId);
  }
  return stars;
};

const reverseOperation = (operation) => {
  switch(operation) {
    case "add":
      return "delete";
    case "delete":
      return "add";
    case "update":
      return "update";
    default:
      throw "No such operation, cannot reverse " + operation;
  }

};

const getReversedChange = (change) => {
  return {
    operation: reverseOperation(change.operation),
    current: change.current && {
      _id: change.current._id,
      ... change.changed
    },
    changed: change.current,
  }
};

export {applyChanges, getReversedChange};