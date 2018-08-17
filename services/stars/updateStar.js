const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single star with the provided update json
async function updateStar(userId, id, update) {
  const s = await Star.update({"_id": id, "userId": userId}, update, {multi: false});
  return s;
}

module.exports = {updateStar};
