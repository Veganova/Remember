//TODO : MIDDLEWARE to check logged in, delete, update, move (update parent id)
// front end: form to call these, display stars
// refactor all 'stars' -> 'stars'


// Exports for stars
const _ = require('lodash')
const mongoose = require('mongoose');

const User = mongoose.model('users');
const Star = mongoose.model('stars');

// good for getting just upper layer of stars fast
 async function findChildren(parentId) {
  const stars = await Star.find({ parentId });
  const result =  _.map(stars, async (star) => {
    const newStar = {};
    newStar.id = star.id;
    newStar.data = star.data;
    const childStars = await findChildren(star.id);
    newStar.stars = childStars;
    return newStar;
  });
  return Promise.all(result);
}
module.exports = {findChildren};
