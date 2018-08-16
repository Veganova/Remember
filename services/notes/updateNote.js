const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single note with the provided update json
async function updateNote(userId, id, update) {
  const s = await Star.update({"_id": id, "userId": userId}, update, {multi: false});
  return s;
}

module.exports = {updateNote};
