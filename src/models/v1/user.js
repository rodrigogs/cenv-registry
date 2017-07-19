const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const SALT_COMPLEXITY = 10;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'User [name] field is required'],
  },
  username: {
    type: String,
    trim: true,
    required: [true, 'User [username] field is required'],
    unique: 'Given username is already in use',
  },
  password: {
    type: String,
    required: [true, 'User [password] field is required'],
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  environments: [{
    type: ObjectId,
    ref: 'Environment',
  }],
  creation_date: {
    type: Date,
    default: new Date(),
  },
});

UserSchema.pre('save', function preSave(next) {
  const user = this;
  if (!user.isModified) return next();

  bcrypt.genSalt(SALT_COMPLEXITY, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next();

      user.password = hash;
      next();
    });
  });
});

UserSchema.post('validate', (doc) => {
  if (doc.isNew) {
    doc.creation_date = new Date();
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

UserSchema.plugin(beautifyUnique);

const User = mongoose.model('User', UserSchema);

module.exports = User;
