const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Ensure that FE and BE are in sync.
const validateDataSynced = (changes, storedStars) => {
  for (let storedStar of storedStars) {
    let currentStar = changes[storedStar._id]['current'];
    // Ignore data check when change is a simple edit.
    // When simple edits are made, only data is updated. The FE will be more up to date, so this check will fail.
    if ((!changes[storedStar._id].isSimpleEdit && currentStar.data !== storedStar.data)
        || currentStar.prev !== storedStar.prev
        || currentStar.next !== storedStar.next
        || currentStar.parentId !== storedStar.parentId) {
      return {
        error: {message: "Input payload representing current elements is out of sync with data stored in table"},
        currentStar,
        storedStar
      }
    }
  }
};

const applyAddChanges = async (userId, changes, results) => {
  const addChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'add');
  for (const addChangeStarId of addChanges) {
    const change = changes[addChangeStarId];
    // Temporary 2 second pause to test slow network connections and de-syncs/broken states
    // await new Promise(r => setTimeout(r, 2000));
    change["saved"] = await new Star({userId, ...change["changed"]}).save();
    results[addChangeStarId] = change;
  }
  return results;
};

const applyUpdateChanges = async (userId, changes, results) => {
  const updateChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'update');
  for (const updateChangeStarId of updateChanges) {
    const change = changes[updateChangeStarId];
    for (const [changedField, changedValue] of Object.entries(change["changed"])) {
      if (["prev", "next", "parentId"].includes(changedField) && changedValue && changedValue.includes("new_node_placeholder")) {
        // Look through already added values to replace the placeholder with the DB generated id.
        change["changed"][changedField] = results[changedValue]["saved"]._id;
      }
    }
    change["saved"] = await Star.findOneAndUpdate({"_id": updateChangeStarId, userId}, change["changed"], {
      multi: false,
      new: true
    });
    results[updateChangeStarId] = change;
  }
  return results;
};

const applyRemoveChanges = async (userId, changes, results) => {
  const removeChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'delete');
  for (const removeChangeStarId of removeChanges) {
    const change = changes[removeChangeStarId];
    change["saved"] = await Star.remove({"_id": removeChangeStarId, userId});
    results[removeChangeStarId] = change;
  }
  return results;
};

// Each change will contain {'current': {...}, 'changed': {...}, 'operation': 'delete/update/add'}
// The current field contains the note's data from the caller (FE) before any changes have been applied. This will be used to
// verify that the state of the FE and BE are in sync.
// The changed field only contains any fields that need to be changed. Ex: 'changed': {prev: 18923u1f813u1}.
const updateChanges = async (userId, changes) => {
  // Remove keys that were created when querying db for existing keys.
  const changedStarIds = Object.keys(changes).filter(key => !key.includes('new_node_placeholder'));
  const storedStars = await Star.find().where('_id').in(changedStarIds).exec();

  validateDataSynced(changes, storedStars);

  // Perform updates on given stars.
  const results = {};
  const addResults = await applyAddChanges(userId, changes, results);
  const updateResults = await applyUpdateChanges(userId, changes, addResults);
  return await applyRemoveChanges(userId, changes, updateResults);
}

module.exports = {updateChanges};
