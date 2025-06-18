const mongoose = require('mongoose');

const familyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FamilyGroup', familyGroupSchema);
