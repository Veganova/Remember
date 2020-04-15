require('../models/Star')
require('../models/User');
const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const keys = require('../config/keys');
const {updateStar} = require("./stars/updateStar");
const { getById, getByParentId } = require('./stars/starsHelper');

mongoose.connect(keys.mongoURI);

function getUserIds(stars) {
  let userIds = new Set([]);
  stars.forEach((star) => userIds.add(star.userId));
  return [...userIds];
}

function compare(a, b) {
  if (a.index < b.index)
    return -1;
  if (a.index > b.index)
    return 1;
  return 0;
}

/**
 * Recurse through these in the same order the front end does
 * at each level, add the note in the correct order
 */
function recurseDown(baseStarId, starsById, starsByParentId) {
  let total = [];
  let childStars = starsByParentId[baseStarId];
  childStars.sort(compare);

  let prevStar = null;
  let childStar;
  for (let i = 0; i < childStars.length; i++) {
    childStar = childStars[i];
    if (prevStar) {
      childStar.prev = prevStar['_id'];
      prevStar.next = childStar['_id'];
    } else {
      childStar.prev = null;
    }

    prevStar = childStar;

    let result = recurseDown(childStars[i]['_id'], starsById, starsByParentId);
    total.push(childStar);
    total.push(...result)
  }

  if (childStar) {
    childStar.next = null;
  }

  return total;
}


function removeStarField(field) {
  let unset = {};
  unset[field] = true;

  Star.collection.update({},
    {$unset: unset},
    {multi: true, safe: true}
  );
}

Star.find()//One({data: "Modes?"})
  .then(oldStars => {
    // var f = new Fraction(x.index);
    if (!oldStars.length) {
      // in case of only one result from query
      oldStars = [oldStars];
    }

    let newStars = [];
    oldStars.forEach((oldStar) => newStars.push(oldStar.toObject()));

    let userIds = getUserIds(newStars);
    let byParentId = getByParentId(newStars);
    let byId = getById(newStars);

    userIds.forEach((userId) => {
      let updateds = recurseDown(userId, byId, byParentId);

      console.log(updateds);
      for(let i = 0; i < updateds.length; i+=1) {
        let updated = updateds[i];
        if (!updated.prev) {
          updated.prev = "";
        }
        if (!updated.next) {
          updated.next = "";
        }
        // console.log(updated);
        if (i + 1 >= updateds.length) {
          updateStar(userId, updated['_id'], {"next": updated.next, "prev":updated.prev}).then((x) => mongoose.disconnect());
        } else {
          updateStar(userId, updated['_id'], {"next": updated.next, "prev":updated.prev});
        }
      }
    });
  })
  .catch((e) => console.log("catch", e));


