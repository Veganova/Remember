const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const {getByParentIdForUser} = require('./notesHelper');

async function showNotes(userId) {
  const allUserStars = await Star.find({ userId });
  const byParentId = getByParentIdForUser(allUserStars);
  return constructNotes(byParentId, userId);
}

function constructNotes(byParentId, parentId) {
  const notes = [];
  const parentStars = byParentId[parentId];

  parentStars.forEach((parentStar, index, theArray) => {
    const childStars = constructNotes(byParentId, parentStar.id);
    const copy = JSON.parse(JSON.stringify(parentStar));
    copy.childStars = childStars;
    notes.push(copy);
  });

  return notes;
}

module.exports = {showNotes};
