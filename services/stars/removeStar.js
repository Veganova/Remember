const mongoose = require('mongoose');
const Star = mongoose.model('stars');

const {updateStar} = require('./updateStar');

async function removeStar(userId, starId) {
  const starToUpdate = await Star.findById(starId);
  if (starToUpdate.parentId === userId) {
  }
  const trashStar = await Star.findOne({"parentId":userId, "data": "Trash"});
  return await updateStar(userId, starId, {parentId: trashStar.id});
}

module.exports = {removeStar};
