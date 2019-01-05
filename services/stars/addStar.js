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

    // create the star with no next and prev. Then perform a move update to fix the neighbours of the stars around it as well.
    let newStar = await new Star({userId, parentId, data, prev: "", next: "", addDisabled}).save();
    console.log("1", newStar);
    console.log("set to", prev, next)
    newStar = await moveStar(userId, prev, next, newStar);
    console.log("2", newStar);
    return newStar;
  }
};
