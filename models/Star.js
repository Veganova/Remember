const mongoose = require('mongoose');
const { Schema } = mongoose;



const starSchema = new Schema({
  parentId: { type:String, required: false },
  data: { type:String, required: false },
});

mongoose.model('stars', starSchema);
