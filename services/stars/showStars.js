const mongoose = require('mongoose');
const Star = mongoose.model('stars');

async function showStars(userId) {
  const allUserStars = await Star.find({ userId }).sort({index:1});
  return allUserStars;
}

module.exports = {showStars};
