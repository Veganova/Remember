require('../models/Star')
require('../models/User');
const Fraction = require('fractional').Fraction
const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const keys = require('../config/keys');
const { getById, getByParentId, findAllIdsUnderParent } = require('./stars/starsHelper');

mongoose.connect(keys.mongoURI);

async function showStars(userId) {
  const allUserStars = await Star.find({ userId }).sort({index:1});
  return allUserStars;
}

function gcd(a, b)
{
  if (b === 0)
    return a;
  return gcd(b, a % b);
}


function isDecimal(num) {
  let numStr = String(num);
  for (let i = 0; i < numStr.length; i++) {
    if (numStr[i] === '.') {
      return true;
    }
  }
  return false;
}

function toFraction(num) {
  if (!isDecimal(num)) {
    throw Error('Number is not of decimal type');
  }

  let tens_exp = String(num).split('.')[1].length;

  let denominator = Math.pow(10, tens_exp);
  let numerator = denominator * num;

  let common_factors = gcd(denominator, numerator);
  denominator = denominator / common_factors
  numerator = numerator / common_factors;
  return {numerator, denominator};
}

/**
 * Takes the old star and performs the transformation and returns the new star
 */
function transform(oldStar) {
  let newStar = JSON.parse(JSON.stringify(oldStar))

  let fraction = toFraction(newStar.index);
  // console.log(fraction, Math.log2(fraction.denominator), isDecimal(Math.log2(fraction.denominator)));
  newStar.newIndex = [fraction.numerator, fraction.denominator];
  return newStar;
}

function getUserIds(stars) {
  let userIds = new Set([]);
  stars.forEach((star) => userIds.add(star.userId));
  return [...userIds];
}

/**
 * Recurse through these in the same order the front end does
 * at each level, add the note in the correct order- averaging and using fractions.
 */
function recurseDown(baseStar, starsById) {

}

Star.find()//One({data: "Modes?"})
  .then(oldStars => {
    // console.log(x)
    // var f = new Fraction(x.index);
    if (!oldStars.length) {
      // in case of only one result from query
      oldStars = [oldStars];
    }

    let newStars = [];
    for (let i = 0; i < oldStars.length; i++) {
      newStars.push(transform(oldStars[i]));
    }

    let userIds = getUserIds(newStars);
    let byParentId = getByParentId(newStars);
    // console.log(byParentId)
    let baseNotes = byParentId[userIds[0]];
    let byId = getById(newStars);

    //TODO
    recurseDown(baseNotes[0], byId)

    // console.log(JSON.stringify(newStars, null, 2));
    // let x = getByParentId(newStars)["5ba6bd315d9b9f555d86b80f"];
    // console.log(x);
    // console.log(findAllIdsUnderParent("5b858783bc38f25cb2b1bb7e", getByParentId(newStars)));
    mongoose.disconnect()
  })
  .catch((e) => console.log("catch", e));


