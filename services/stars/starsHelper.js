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

function getById(allStars) {
  const byId= {};
  allStars.forEach((star) => {
    byId[star.id] = star;
  });
  return byId;
}

function getByParentId(allStars) {
  const byParentId = {};
  allStars.forEach((star) => {
    if (!byParentId[star.parentId]) {
      byParentId[star.parentId] = [];
    }
    if (!byParentId[star['_id']]) {
      byParentId[star['_id']] = [];
    }
    byParentId[star.parentId].push(star);
  });
  return byParentId;
}

// recieves flat list and returns a list of ids
function findAllIdsUnderParent(parentId, starByParentId) {
  const total = [];
  const childStars = starByParentId[parentId];
  for (let i = 0; i < childStars.length; i++) {
    let childStar = childStars[i];
    total.push(childStar.id);
    total.concat(findAllIdsUnderParent(childStar.id, starByParentId));
  }
  return total;
}


module.exports = { findChildren, findAllIdsUnderParent, getById, getByParentId };
