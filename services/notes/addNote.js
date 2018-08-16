const mongoose = require('mongoose');
const Star = mongoose.model('stars');


module.exports = {
  "addNote": async (userId, parentId, data) => {
    const existingStar = await Star.findOne({userId, parentId, data});
    if (existingStar) {
      return existingStar;
    }
    const newStar = await new Star({userId, parentId, data}).save();
    return newStar;
  }
};
