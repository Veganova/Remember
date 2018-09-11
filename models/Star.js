// Each star with userId = parentId is a root star which will represent a unique page in the front end.
const mongoose = require('mongoose');
const { Schema } = mongoose;



const starSchema = new Schema({
  userId: { type:String, required: true },
  parentId: { type:String, required: true},
  data: { type:String, required: true},
  index: { type: Number, required: true },
  addDisabled: { type: Boolean, default: false, required: false }
});

mongoose.model('stars', starSchema);
