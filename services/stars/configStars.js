const {addStar} = require('./addStar');

module.exports = {
  "configStars" : (user) => {
    // Config for a new users
    addStar(user.id, user.id, "Trash", 0.8);
    addStar(user.id, user.id, "Stars", 0.2);
  }
}
