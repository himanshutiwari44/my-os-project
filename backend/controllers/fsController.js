const FsEntry = require('../models/fsEntry');

// Helper to normalize path
function normPath(p) {
  if (!p) return '/';
  if (p === '/') return '/';
  if (p.endsWith('/') && p !== '/') p = p.slice(0, -1);
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

exports.list = async (req, res) => {
  try {
    const path = normPath(req.query.path || '/');
    const entries = await FsEntry.find({ parent: path }).lean();
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.mkdir = async (req, res) => {
  try {
    const { path, name } = req.body;
    const p = normPath(path);
    const nameClean = name;
    const newPath = p === '/' ? `/${nameClean}` : `${p}/${nameClean}`;

    // check exists
    const exists = await FsEntry.findOne({ path: newPath });
    if (exists) return res.status(400).json({ error: 'File/Directory exists' });

    const entry = new FsEntry({ name: nameClean, path: newPath, type: 'directory', parent: p });
    await entry.save();
    res.json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.touch = async (req, res) => {
  try {
    const { path, name } = req.body;
    const p = normPath(path);
    const nameClean = name;
    const newPath = p === '/' ? `/${nameClean}` : `${p}/${nameClean}`;

    const exists = await FsEntry.findOne({ path: newPath });
    if (exists) return res.status(400).json({ error: 'File/Directory exists' });

    const entry = new FsEntry({ name: nameClean, path: newPath, type: 'file', parent: p });
    await entry.save();
    res.json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { path } = req.body;
    const p = normPath(path);

    const entry = await FsEntry.findOne({ path: p });
    if (!entry) return res.status(404).json({ error: 'Not found' });

    // If directory, delete children recursively
    if (entry.type === 'directory') {
      await FsEntry.deleteMany({ path: new RegExp('^' + p + '(/|$)') });
    } else {
      await entry.deleteOne();
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pwd = async (req, res) => {
  try {
    const path = normPath(req.query.path || '/');
    // return path and metadata
    const entry = await FsEntry.findOne({ path });
    if (!entry && path !== '/') {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tree = async (req, res) => {
  // return all entries for visualization
  try {
    const entries = await FsEntry.find({}).lean();
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
