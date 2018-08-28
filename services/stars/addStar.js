const mongoose = require('mongoose');
const Star = mongoose.model('stars');


module.exports = {
  // Index is a decimal between 0 - 1 to giver ordering.
  "addStar": async (userId, parentId, data, index) => {
    const existingStar = await Star.findOne({userId, parentId, data});

    // stars with the same data under the same parent are considered duplicate - not allowed
    if (existingStar) {
      return { "error": "existingStar"};
    }
    const newStar = await new Star({userId, parentId, data, index}).save();
    return newStar;
  }
};
