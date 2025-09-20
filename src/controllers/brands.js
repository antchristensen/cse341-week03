const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const col = () => getDb().collection('brands');

exports.list = async (_req, res) => {
  const docs = await col().find({}).toArray();
  res.json(docs);
};

exports.get = async (req, res) => {
  const doc = await col().findOne({ _id: new ObjectId(req.params.id) });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
};

exports.create = async (req, res) => {
  const result = await col().insertOne(req.validated);
  res.status(201).json({ _id: result.insertedId, ...req.validated });
};

exports.update = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await col().findOneAndUpdate(
    { _id: id },
    { $set: req.validated },
    { returnDocument: 'after' }
  );
  if (!result.value) return res.status(404).json({ error: 'Not found' });
  res.json(result.value);
};

exports.remove = async (req, res) => {
  const out = await col().deleteOne({ _id: new ObjectId(req.params.id) });
  if (out.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
};
