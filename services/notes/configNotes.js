const {addNote} = require('./addNote');

module.exports = {
  "configNotes" : (user) => {
    // Config for a new users
    addNote(user.id, user.id, "Trash");
    addNote(user.id, user.id, "Notes");
  }
}
