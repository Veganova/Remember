const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const { moveStar } = require("./updateStar");

module.exports = {
  // Index is a decimal between 0 - 1 to giver ordering.
  "addStar": async (userId, parentId, data, prev, next, addDisabled) => {
    addDisabled = Boolean(addDisabled);



    if (parentId === userId) {
      // Top level user star only
    }
    else {
      // All other stars
      const existingParent = await Star.findOne({userId, "_id": parentId});
      if (!existingParent ) {
        return { "error": "Parent doesn't exist"}
      }
      if (existingParent.addDisabled) {
        return { "error": "Add disabled on selected parent"};
      }
    }

    const newStar = await new Star({userId, parentId, data, prev, next, addDisabled}).save();
    const rv = await moveStar(prev, next, newStar);

    return newStar;
  }
};
