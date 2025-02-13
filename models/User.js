const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    user_name: String,
    user_contact: Number,
    user_email: { type: String, required: true, unique: true },
    user_password: String,
    user_address: String,
    user_DOB: Date,
    user_role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    user_created_at: { type: Date, default: Date.now },
    user_updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);