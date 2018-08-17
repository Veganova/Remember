const {addStar} = require('./addStar');

module.exports = {
  "configStars" : (user) => {
    // Config for a new users
    addStar(user.id, user.id, "Trash");
    addStar(user.id, user.id, "Stars");
  }
}
