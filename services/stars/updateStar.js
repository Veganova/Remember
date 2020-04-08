const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single star with the provided update json
async function updateStar(userId, id, update) {
  return Star.findOneAndUpdate({"_id": id, userId}, update, {multi: false, new: true});
}

// updatePayload contains current and changed versions for each star that needs to be updated.
async function updateChanges(userId, changes) {
  // Remove keys that were created when querying db for existing keys.
  const changedStarIds = Object.keys(changes).filter(key => !key.includes('new_node_placeholder'));
  const storedStars = await Star.find().where('_id').in(changedStarIds).exec();
  // Ensure that FE and BE are in sync.
  for (let storedStar of storedStars) {
    let currentStar = changes[storedStar._id]['current'];
    if (currentStar.data !== storedStar.data
        || currentStar.prev !== storedStar.prev
        || currentStar.next !== storedStar.next
        || currentStar.parentId !== storedStar.parentId) {
      return { "error": "Input payload representing current elements is out of sync with data stored in table", currentStar, storedStar}
    }
  }

  // Perform updates on given stars.
  const results = {};
  const addChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'add');
  for (const addChangeStarId of addChanges) {
    const change = changes[addChangeStarId];
    await new Promise(r => setTimeout(r, 2000));
    change["saved"] = await new Star({userId, ...change["changed"]}).save();
    results[addChangeStarId] = change;
  }

  const updateChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'update');
  for (const updateChangeStarId of updateChanges) {
    const change = changes[updateChangeStarId];
    for (const [ changedField, changedValue ] of Object.entries(change["changed"])) {
      if (["prev", "next", "parentId"].includes(changedField) && changedValue.includes("new_node_placeholder")) {
        // Look through already added values to replace the placeholder with the DB generated id.
        change["changed"][changedField] = results[changedValue]["saved"]._id;
      }
    }
    change["saved"] = await Star.findOneAndUpdate({"_id": updateChangeStarId, userId}, change["changed"], {multi: false, new: true});
    results[updateChangeStarId] = change;
  }

  const removeChanges = Object.keys(changes).filter(starId => changes[starId]["operation"] === 'delete');
  for (const removeChangeStarId of removeChanges) {
    const change = changes[removeChangeStarId];
    change["saved"] = await Star.remove({"_id": removeChangeStarId, userId});
  }

  return results;
}


async function moveStarById(userId, prevId, nextId, starId) {
  const star = await Star.findOne({userId, '_id': starId});
  return moveStar(userId, prevId, nextId, star);
}

/**
 * Moves the star by fixing the next, prev pointers of the stars at the current and new location.
 * Last star in the returned list should be the targeted one (the one that was actually moved). Rest are ones affected.
 *
 * @param userId
 * @param prevId  id of star right before the current new location (null if there is none)
 * @param nextId  id of star right after the current new location (null if there is none)
 * @param star    star object with a next and prev pointing to the stars at its location prior to the move.
 */
async function moveStar(userId, prevId, nextId, star) {
  let starId = star['id'];
  // let bulk = Star.collection.initializeUnorderedBulkOp();

  // Update stars at previous location
  let changedStars = [];
  if (star.prev) {
    changedStars.push(await updateStar(userId, star.prev, {next: star.next}));
  }
  if (star.next) {
    changedStars.push(await updateStar(userId, star.next, {prev: star.prev}));
  }

  // Update stars at new location (where the star is moved to)
  if (prevId) {
    changedStars.push(await updateStar(userId, prevId, {next: starId}));
  }

  changedStars.push(await updateStar(userId, starId, {prev: prevId, next: nextId}));

  if (nextId) {
    changedStars.push(await updateStar(userId, nextId, {prev: starId}));
  }


  return changedStars;
  // let rv = await Star.find({userId, "_id": starId}).update({$set: {prev: prevId, next: nextId}});
  // // bulk.execute();
  // return rv;
}


module.exports = {updateStar, updateChanges, moveStar, moveStarById};
