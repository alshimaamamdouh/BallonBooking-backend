const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  city: { type: String, default: '' },
  zip: { type: String, default: '' },
  country: { type: String, default: '' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }  
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check the entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('findByIdAndDelete', async function (next) {
  const references = [
    { model: mongoose.model('Cart'), field: 'user' },
    { model: mongoose.model('Order'), field: 'user' },
    { model: mongoose.model('Wishlist'), field: 'user' }
  ];

  const isReferenced = await isDocumentReferenced(this._id, references);
  if (isReferenced) {
    return next(new Error('Cannot delete: User is referenced in other collections.'));
  }

  next();
});
module.exports = mongoose.model('User', userSchema);

