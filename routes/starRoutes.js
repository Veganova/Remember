const {addStar} = require('../services/stars/addStar');
const {removeStar} = require('../services/stars/removeStar');
const {showStars, constructStars}  = require('../services/stars/showStars');
const {updateStar}  = require('../services/stars/updateStar');

module.exports = (app) => {
  app.use("/api/star", (req, res, next) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      next();
    }
  });

  app.post('/api/star/add', async (req, res) => {

    const body = req.body;
    const userId = req.user.id;
    const parentId = body.parentId || userId;
    const data = body.data;
    const newStar = await addStar(userId, parentId, data);

    const arg = {};
    arg[newStar.parentId] = [newStar];
    arg[newStar.id] = [];
    const formattedStar = constructStars(arg, newStar.parentId);
    res.send(formattedStar);
  });

  // Takes in a userId, starId, and an updateJson as needed by the mongoose.update(..) call
  app.put('/api/star/update', async (req, res) => {
    const body = req.body;
    const userId = req.user.id;
    const starId = req.body.starId;
    const update = req.body.update;
    const result = await updateStar(userId, starId, update);
    res.send(result);
  });

  app.get('/api/star/get', async (req, res) => {
    const userId = req.user.id;
    const stuff = await showStars(userId);
    res.send(stuff);
  });
  app.delete('/api/star/remove', async (req, res) => {
    const userId = req.user.id;
    const starId = req.body.id;
    const stuff = await removeStar(userId, starId);
    res.send(stuff);
  });
}
