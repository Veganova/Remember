require('../../models/Star')
require('../../models/User');
const mongoose = require('mongoose');
const Star = mongoose.model('stars');
const keys = require('../../config/keys');

mongoose.connect(keys.mongoURI);

const USER_ID = "5ba6bc3d875b2a5466cd3ded";


Star.remove({userId: USER_ID}, (err, x) => {
  console.log(x);
})

const newStars = [
  {
    _id: 'root_notes',
    data: 'Notes',
    parentId: USER_ID,
    prev: null,
    next: 'root_trash',
    userId: USER_ID
  }, // Notes under main root
  {
    _id: 'root_trash',
    data: 'Trash',
    parentId: USER_ID,
    prev: 'root_notes',
    next: 'root_created',
    userId: USER_ID
  },
  {
    _id: 'root_created',
    data: 'user made top level',
    parentId: USER_ID,
    prev: 'root_trash',
    next: null,
    userId: USER_ID
  },// User made
  {
    _id: 'note_child1',
    data: 'note child1 data',
    parentId: 'root_notes',
    prev: null,
    next: 'note_child2'
  },
  {
    _id: 'note_child2',
    data: 'note child2 data',
    parentId: 'root_notes',
    prev: 'note_child1',
    next: 'note_child3',
  },
  {
    _id: 'note_child3',
    data: 'note child3 data',
    parentId: 'root_notes',
    prev: 'note_child2',
    next: null
  },// Trashed nodes:
  {
    _id: 'trash_child1',
    data: 'trash child data',
    parentId: 'root_trash',
    prev: null,
    next: null,
  }
];

const created = {};

for (let i in newStars) {
  const newStar = newStars[i];
  created[newStar._id] = new Star({
    userId: USER_ID,
    parentId: newStar.parentId,
    data: newStar.data,
    prev: newStar.prev,
    next: newStar.next
  });
}
// console.log(created);
for (let key in created) {
  const createdStar = created[key];
  if (createdStar.prev) {
    createdStar.prev = created[createdStar.prev]._id
  }
  if (createdStar.next) {
    createdStar.next = created[createdStar.next]._id
  }
  if (createdStar.parentId !== USER_ID) {
    createdStar.parentId = created[createdStar.parentId]._id
  }
}

console.log(created);
for (let key in created) {
  const createdStar = created[key];
  createdStar.save(function (err, star) {
    if (err) console.error(err);
    console.log("saved to star collection." + star['_id']);
  });
}

