const mongoose = require('mongoose');

const User = mongoose.model('users');
const Star = mongoose.model('stars');

module.exports = (app) => {
  app.post('/api/note/add', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const data = req.body;
      const userId = req.user.id;
      const parentId = data.parentId || userId;
      const title = data.title;
      console.log(userId);
      console.log(title);
      const description = data.description;
      const baseStar = await saveStar(parentId, title);
      const noteStar = await saveStar(baseStar.id, description);
      res.send({baseStar, noteStar});async
    }
  });
}

// app.use('/api/:note', function (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// })

async function saveStar(parentId, data) {
  const existingStar = await Star.findOne({parentId, data});
  if (existingStar) {
    return existingStar;
  }
  const newStar = await new Star({parentId, data}).save();
  return newStar;
}
