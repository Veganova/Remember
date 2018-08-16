const mongoose = require('mongoose');
const Star = mongoose.model('stars');

const {updateNote} = require('./updateNote');

async function removeNote(userId, starId) {
  const starToUpdate = await Star.findById(starId);
  if (starToUpdate.parentId === userId) {
    console.log('deleting root -- send a confirmation');
  }
  const trashStar = await Star.findOne({"parentId":userId, "data": "Trash"});
  return await updateNote(userId, starId, {parentId: trashStar.id});
}

module.exports = {removeNote};
