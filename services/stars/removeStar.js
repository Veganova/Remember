const mongoose = require('mongoose');
const Star = mongoose.model('stars');

const {updateStar} = require('./updateStar');
const { findAllIdsUnderParent, getByParentId } = require('./starsHelper');



async function removeStar(userId, starId, parentId) {
  const trashStar = await Star.findOne({userId, "parentId":userId, "data": "Trash"});
  if (trashStar.id === parentId) {
    const allStars = await Star.find({ userId });
    const ids = findAllIdsUnderParent(starId, getByParentId(allStars));
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
  return await Star.findOneAndUpdate({"_id": starId, "userId": userId}, update, options);
}

module.exports = {removeStar};
