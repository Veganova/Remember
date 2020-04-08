const {addStar} = require('../services/stars/addStar');
const {removeStar} = require('../services/stars/removeStar');
const {removeChildren} = require('../services/stars/removeChildren');
const {showStars}  = require('../services/stars/showStars');
const {updateStar, updateChanges, moveStarById}  = require('../services/stars/updateStar');

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
    const prev = body.prevId;
    const next = body.nextId;
    const newStar = await addStar(userId, parentId, data, prev, next);

    res.send(newStar);
  });

  // Takes in a userId, starId, and an updateJson as needed by the mongoose.update(..) call
  app.put('/api/star/update', async (req, res) => {
    const body = req.body;
    const userId = req.user.id;
    const starId = req.body.id;
    const update = req.body.update;
    const result = await updateStar(userId, starId, update);
    res.send(result);
  });

  app.put('/api/star/updateChanges', async (req, res) => {
    const body = req.body;
    const userId = req.user.id;
    const changes = req.body.changes;
    const result = await updateChanges(userId, changes);
    res.send(result);
  });

  app.put('/api/star/move', async (req, res) => {
    const userId = req.user.id;
    const prevId = req.body.prevId;
    const nextId = req.body.nextId;
    const starId = req.body.starId;

    const result = await moveStarById(userId, prevId, nextId, starId);
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

  app.delete('/api/star/removeChildren', async (req, res) => {
    const userId = req.user.id;
    const parentId = req.body.parentId;

    const stuff = await removeChildren(userId, parentId);
    res.send(stuff);
  });
};
