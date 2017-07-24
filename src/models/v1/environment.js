const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const EnvironmentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Environment [name] field is required'],
    unique: 'Given name is already in use',
  },
  variables: [{
    type: ObjectId,
    ref: 'Variable',
  }],
  created_by: {
    type: ObjectId,
    ref: 'User',
    required: [true, 'Environment [created_by] field is required'],
  },
  creation_date: {
    type: Date,
    default: new Date(),
  },
});

EnvironmentSchema.post('validate', (doc) => {
  if (doc.isNew) {
    doc.creation_date = new Date();
  }
});

EnvironmentSchema.plugin(beautifyUnique);

const Environment = mongoose.model('Environment', EnvironmentSchema);

module.exports = Environment;
