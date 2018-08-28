const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single star with the provided update json
async function updateStar(userId, id, update) {
  const s = await Star.findOneAndUpdate({"_id": id, userId, parentId}, update, {multi: false, new: true});
  return s;
}

module.exports = {updateStar};
