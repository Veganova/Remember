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
  if (star.prev) {
    await Star.find({userId, "_id": star.prev}).update({$set: {next: star.next}});
  }
  if (star.next) {
    await Star.find({userId, "_id": star.next}).update({$set: {prev: star.prev}});
  }

  // Update stars at new location (where the star is moved to)
  if (prevId) {
    await Star.find({userId, "_id": prevId}).update({$set: {next: starId}});
  }
  if (nextId) {
    await Star.find({userId, "_id": nextId}).update({$set: {prev: starId}});
  }
  await Star.find({userId, "_id": starId}).update({$set: {prev: prevId, next: nextId}});
  // bulk.execute();
  return {d: "done"};
  // return new Promise((resolve, reject) => bulk.execute((x) => resolve(x)));
}


module.exports = {updateStar, moveStar, moveStarById};
