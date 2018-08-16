const mongoose = require('mongoose');
const Star = mongoose.model('stars');

// Updates single note with the provided update json
async function updateNote(id, update) {
  const s = await Star.update({"_id": id}, update, {multi: false});
  return s;
}

module.exports = {updateNote};
