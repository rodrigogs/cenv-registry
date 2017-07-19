const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const Schema = mongoose.Schema;

const VariableSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Variable [name] field is required'],
  },
  value: {
    type: String,
    required: false,
  },
});

VariableSchema.plugin(beautifyUnique);

const Variable = mongoose.model('Variable', VariableSchema);

module.exports = Variable;
