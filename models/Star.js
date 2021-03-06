// Each star with userId = parentId is a root star which will represent a unique page in the front end.
const mongoose = require('mongoose');
const { Schema } = mongoose;



const starSchema = new Schema({
  userId: { type:String, required: true },
  parentId: { type:String, required: true},
  data: { type:String, required: dataShouldNotBeNull, validation: [dataValidation, "Data is incorrect for star"] },
  index: { type: Number, required: false },
  addDisabled: { type: Boolean, default: false, required: false },
  prev: { type:String, validation: [linkReq, "Data is incorrect for prev"] },
  next: { type:String, validation: [linkReq, "Data is incorrect for next"] }
});

function dataShouldNotBeNull () {
  // Required flag is turned on when provided data is null
  return this.data === null;
}

function dataValidation(data) {
  return typeof data === 'string';
}
function myRequired() {
  return !(this.data !== null && this.data !== undefined && typeof this.data === 'string');
}


function linkReq() {
  return true;
}

mongoose.model('stars', starSchema);
