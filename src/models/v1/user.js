const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const crypto = require('crypto');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

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
  hashed_password: {
    type: String,
    required: [true, 'User [password] field is required'],
  },
  salt: {
    type: String,
    required: true,
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

UserSchema.virtual('password')
  .set(function set(password) {
    this._plain_password = password;
    this.salt = crypto.randomBytes(128).toString('base64');
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function get() { return this._plain_password; });

UserSchema.methods.encryptPassword = function encryptPassword(password) {
  return crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

UserSchema.post('validate', (doc) => {
  if (doc.isNew) {
    doc.creation_date = new Date();
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return this.encryptPassword(candidatePassword) === this.hashed_password;
};

UserSchema.plugin(beautifyUnique);

const User = mongoose.model('User', UserSchema);

module.exports = User;
