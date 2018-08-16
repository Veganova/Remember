const mongoose = require('mongoose');
const { Schema } = mongoose;



const starSchema = new Schema({
  userId: { type:String, required: true },
  parentId: { type:String, required: true},
  data: { type:String, required: true},
});

mongoose.model('stars', starSchema);
