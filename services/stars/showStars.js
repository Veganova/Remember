const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const {getByParentIdForUser} = require('./starsHelper');

async function showStars(userId) {
  const allUserStars = await Star.find({ userId });
  const byParentId = getByParentIdForUser(allUserStars);
  return constructStars(byParentId, userId);
}

/**
*   Needs there to be a mapping for every single star id (below the parentId) -> list of children stars
**/
function constructStars(byParentId, parentId) {
  const stars = [];
  const parentStars = byParentId[parentId];

  parentStars.forEach((parentStar, index, theArray) => {
    const childStars = constructStars(byParentId, parentStar.id);
    const copy = JSON.parse(JSON.stringify(parentStar));
    copy.childStars = childStars;
    stars.push(copy);
  });

  return stars;
}

module.exports = {showStars, constructStars};
