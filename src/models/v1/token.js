const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TokenSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  value: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expiry_date: {
    type: Date,
    default: null,
  },
  creation_date: {
    type: Date,
    default: new Date(),
  },
});

TokenSchema.post('validate', (doc) => {
  if (doc.isNew) {
    doc.creation_date = new Date();
  }
});

TokenSchema.methods.isActive = function isActive() {
  const now = new Date();
  const isExpired = this.expiry_date && this.expiry_date.getTime() >= now.getTime();
  return this.active && !isExpired;
};

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;
