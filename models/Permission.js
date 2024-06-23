const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission_level: { type: String, enum: ['admin', 'user'], required: true }
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
