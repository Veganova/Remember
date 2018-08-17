const {addNote} = require('../services/notes/addNote');
const {removeNote} = require('../services/notes/removeNote');
const {showNotes}  = require('../services/notes/showNotes');
const {updateNote}  = require('../services/notes/updateNote');

module.exports = (app) => {
  app.use("/api/note", (req, res, next) => {
    if (!req.user) {
      res.send({error: 'No user'});
    }
    next();
  });

  app.post('/api/note/add', async (req, res) => {

    const body = req.body;
    const userId = req.user.id;
    const parentId = body.parentId || userId;
    const data = body.data;
    const newStar = await addNote(userId, parentId, data);
    res.send(newStar);

  });

  // Takes in a userId, starId, and an updateJson as needed by the mongoose.update(..) call
  app.put('/api/note/update', async (req, res) => {
    const body = req.body;
    const userId = req.user.id;
    const starId = req.body.starId;
    const update = req.body.update;
    const result = await updateNote(userId, starId, update);
    res.send(result);
  });

  app.get('/api/note/get', async (req, res) => {
    const userId = req.user.id;
    const stuff = await showNotes(userId);
    res.send(stuff);
  });
  app.delete('/api/note/remove', async (req, res) => {
    const userId = req.user.id;
    const starId = req.body.starId;
    const stuff = await removeNote(userId, starId);
    res.send(stuff);
  });
}
