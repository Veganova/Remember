const {addStar} = require('./addStar');

module.exports = {
  "configStars" : async (user, username) => {
    // Config for a new users
    // const userStar = await addStar(user.id, user.id, username, 0);
    const rVal = await addStar(user.id, user.id, "Trash", 0.8, true);
    const rVal1 = await addStar(user.id, user.id, "Notes", 0.2);
  }
}
