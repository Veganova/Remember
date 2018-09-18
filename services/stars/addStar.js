const mongoose = require('mongoose');
const Star = mongoose.model('stars');


module.exports = {
  // Index is a decimal between 0 - 1 to giver ordering.
  "addStar": async (userId, parentId, data, index, addDisabled) => {
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
      else if (existingParent.addDisabled) {
        return { "error": "Add disabled on selected parent"};
      }
    }

    const newStar = await new Star({userId, parentId, data, index, addDisabled}).save();
    console.log(newStar);
    return newStar;
  }
};
