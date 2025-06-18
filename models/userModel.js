const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'fam_head', 'user'], default: 'user' },
    avatarUrl: { type: String },
    familyGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyGroup' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
}, { timestamps: true });
    
module.exports = mongoose.model('user', userSchema);
