//TODO : MIDDLEWARE to check logged in, delete, update, move (update parent id)
// front end: form to call these, display notes
// refactor all 'notes' -> 'stars'


// Exports for notes
const _ = require('lodash')
const mongoose = require('mongoose');

const User = mongoose.model('users');
const Star = mongoose.model('stars');

function getByParentIdForUser(allUserStars) {
  const byParentId = {};
  allUserStars.forEach((star) => {
    if (!byParentId[star.parentId]) {
      byParentId[star.parentId] = [];
    }
    if (!byParentId[star.id]) {
      byParentId[star.id] = [];
    }
    byParentId[star.parentId].push(star);
  });
  return byParentId;
}

// good for getting just upper layer of notes fast
 async function findChildren(parentId) {
  console.log(parentId);
  const stars = await Star.find({ parentId });
  const result =  _.map(stars, async (star) => {
    const newStar = {};
    newStar.id = star.id;
    newStar.data = star.data;
    const childStars = await findChildren(star.id);
    console.log(childStars);
    newStar.stars = childStars;
    return newStar;
  });
  return Promise.all(result);
}
module.exports = {getByParentIdForUser, findChildren};
