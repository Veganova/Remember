// Each star with userId = parentId is a root star which will represent a unique page in the front end.
const mongoose = require('mongoose');
const { Schema } = mongoose;



const starSchema = new Schema({
  userId: { type:String, required: true },
  parentId: { type:String, required: true},
  data: { type:String, required: myRequired, validation: [dataValidation, "Data is incorrect for star"] },
  index: { type: Number, required: false },
  addDisabled: { type: Boolean, default: false, required: false },
  prev: { type:String, required: true },
  next: { type:String, required: true }
});

function dataValidation(data) {
  return typeof data === 'string';
}
function myRequired() {
  return !(this.data !== null && this.data !== undefined && typeof this.data === 'string');
}

mongoose.model('stars', starSchema);
