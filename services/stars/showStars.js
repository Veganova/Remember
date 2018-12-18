const mongoose = require('mongoose');
const Star = mongoose.model('stars');


async function showStars(userId) {
  const stars = await Star.find({ userId });//.sort({index:1});

  return stars;
}

module.exports = {showStars};
