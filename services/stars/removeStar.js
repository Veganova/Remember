const mongoose = require('mongoose');
const Star = mongoose.model('stars');

const {updateStar} = require('./updateStar');
const { findAllIdsUnderParent, getById, getByParentId } = require('./starsHelper');

function isStarInTrash(star, byId) {
    if (star.userId === star.parentId) {
      return star.data === "Trash";
    }
    return isStarInTrash(byId[star.parentId], byId);
}

async function removeStar(userId, starId) {
  const allStars = await Star.find({ userId });
  const trashStar = allStars.find(star => star.parentId === userId && star.data === "Trash");
  const star = allStars.find(star => star.id === starId)
  const byId = getById(allStars);
  const isTrash = isStarInTrash(star, byId);
  if (isTrash) {
    const byParentId = getByParentId(allStars);
    const ids = findAllIdsUnderParent(starId, byParentId);
    ids.push(starId);
    //parentId refers to trash already - remove permentantly
    const result = await Star.deleteMany({ userId, "_id": {$in: ids}});

    if (!result || result.error) {
      return { "error": "delete failed", result }
    }

    return { "deleted" : ids, result }
  }
  const update = {parentId: trashStar.id};
  const options = {multi: false, new: true};
  return Star.findOneAndUpdate({"_id": starId, "userId": userId}, update, options);
}

module.exports = {removeStar};
