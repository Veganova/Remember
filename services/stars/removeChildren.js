const _ = require('lodash');
const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const { findAllIdsUnderParent, getByParentId } = require('./starsHelper');

async function removeChildren(userId, parentId) {
  const trashStar = await Star.findOne({userId, "data":"Trash", parentId:userId});

  if (trashStar.id === parentId) {
    //parentId refers to trash already - remove permentantly
    const allStars = await Star.find({userId});
    const ids = findAllIdsUnderParent(trashStar.id, getByParentId(allStars));
    //parentId refers to trash already - remove permentantly
    const result = await Star.deleteMany({ userId, "_id": {$in: ids}});

    if (!result || result.error) {
      return { "error": "delete failed", result }
    }

    return { "deleted" : ids, result }
  }

  const allStars = await Star.find({userId, parentId});
  const ids = _.map(allStars, (star) => star['_id']);
  // options new returns the new object
  const result = await Star.updateMany({ userId,  "_id": {$in: ids}}, { parentId: trashStar.id }, { new: true });

  return { "trashed": ids, result };
}

module.exports = { removeChildren };
