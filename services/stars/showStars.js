const mongoose = require('mongoose');
const Star = mongoose.model('stars');


async function showStars(userId) {
  return await Star.find({userId});
}

module.exports = {showStars};
