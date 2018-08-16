const _ = require('lodash')
const mongoose = require('mongoose');

const User = mongoose.model('users');
const Star = mongoose.model('stars');

module.exports = (app) => {
  app.post('/api/note/add', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const body = req.body;
      const userId = req.user.id;
      const parentId = body.parentId || userId;
      const data = body.data;
      const newStar = await addStar(userId, parentId, data);
      res.send(newStar);
    }
  });
  app.get('/api/note/get', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const userId = req.user.id;
      const stuff = await showNotes(userId);
      console.log("sent");
      res.send(stuff);
    }
  });
}

// app.use('/api/:note', function (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// })

async function addStar(userId, parentId, data) {
  const existingStar = await Star.findOne({userId, parentId, data});
  if (existingStar) {
    return existingStar;
  }
  const newStar = await new Star({userId, parentId, data}).save();
  return newStar;
}

async function findChildren (parentId) {
    const stars = await Star.find({ parentId });

}

function getByParentIdForUser (allUserStars) {
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

async function showNotes(userId) {
  const allUserStars = await Star.find({ userId });
  const byParentId = getByParentIdForUser(allUserStars);
  return constructNotes(byParentId, userId);
}

function constructNotes(byParentId, parentId) {
  const notes = [];
  const parentStars = byParentId[parentId];
  if (parentStars) {
  parentStars.forEach((parentStar) => {
    const childStars = constructNotes(byParentId, parentStar.id);
    parentStar.children = childStars;
    notes.push(parentStar);
  });
}
  return notes;
}

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
