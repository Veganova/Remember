const {showStars} = require('../services/stars/showStars');
const {updateChanges} = require('../services/stars/updateStar');

module.exports = (app) => {
  app.use("/api/star", (req, res, next) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      next();
    }
  });

  app.put('/api/star/updateChanges', async (req, res) => {
    const userId = req.user.id;
    const changes = req.body.changes;

    try {
      const result = await updateChanges(userId, changes);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.send({
        error: {message: error.message}
      });
    }
  });

  app.get('/api/star/get', async (req, res) => {
    const userId = req.user.id;
    const stuff = await showStars(userId);
    res.send(stuff);
  });
};
