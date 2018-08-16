const {addNote} = require('../services/notes/addNote');
const {removeNote} = require('../services/notes/removeNote');
const {showNotes}  = require('../services/notes/showNotes');
const {updateNote}  = require('../services/notes/updateNote');

module.exports = (app) => {
  app.post('/api/note/add', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const body = req.body;
      const userId = req.user.id;
      const parentId = body.parentId || userId;
      const data = body.data;
      const newStar = await addNote(userId, parentId, data);
      res.send(newStar);
    }
  });

  // Takes in a userId, starId, and an updateJson as needed by the mongoose.update(..) call
  app.put('/api/note/update', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const body = req.body;
      const userId = req.user.id;
      const starId = req.body.starId;
      const update = req.body.update;
      const result = await updateNote(userId, starId, update);
      res.send(result);
    }
  });

  app.get('/api/note/get', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const userId = req.user.id;
      const stuff = await showNotes(userId);
      res.send(stuff);
    }
  });
  app.delete('/api/note/remove', async (req, res) => {
    if (!req.user) {
      res.send({error: 'No user'});
    } else {
      const userId = req.user.id;
      const starId = req.body.starId;
      const stuff = await removeNote(userId, starId);
      res.send(stuff);
    }
  });
}
