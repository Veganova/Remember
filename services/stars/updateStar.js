const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single star with the provided update json
async function updateStar(userId, id, update) {
  const s = await Star.findOneAndUpdate({"_id": id, userId}, update, {multi: false, new: true});
  return s;
}


async function moveStarById(userId, prevId, nextId, starId) {
  const star = await Star.findOne({userId, '_id': starId});
  const rv  = await moveStar(userId, prevId, nextId, star);
  return rv;
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
  // return new Promise((resolve, reject) => bulk.execute((x) => resolve(x)));
}


module.exports = {updateStar, moveStar, moveStarById};
