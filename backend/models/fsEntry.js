const mongoose = require('mongoose');

const FsEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true, index: true },
  type: { type: String, enum: ['file', 'directory'], required: true },
  parent: { type: String, required: true }, // parent path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FsEntry', FsEntrySchema);
