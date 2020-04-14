const {updateChanges} = require('./updateStar');

module.exports = {
  "configStars" : async (user, username) => {
    // Config for a new users
    const changes = {
      'new_node_place_holder_1' : {
        _id: 'new_node_place_holder_1',
        data: 'Notes',
        parentId: user._id,
        prev: null,
        next: 'new_node_place_holder_2',
        userId: user._id
      },
      'new_node_place_holder_2': {
        _id: 'new_node_place_holder_2',
        data: 'Trash',
        parentId: user._id,
        prev: 'new_node_place_holder_2',
        next: null,
        userId: user._id
      }
    };
    return await updateChanges(user._id, changes);
  }
};
