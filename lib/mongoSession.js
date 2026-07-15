const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const SESSION_DIR = path.join(__dirname, '..', 'session');
const DB_NAME = 'mltn_md';
const COLLECTION_NAME = 'sessions';
const DOC_ID = process.env.BOT_ID || 'baileys_session';
let client;
let collection;

async function getCollection() {
  if (collection) return collection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MONGODB_URI not set — session will NOT persist across restarts.');
    return null;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log('✅ Connected to MongoDB for session persistence.');
    return collection;
  } catch (err) {
    console.log('❌ Failed to connect to MongoDB:', err.message);
    return null;
  }
}

async function downloadSession() {
  const col = await getCollection();
  if (!col) return;

  try {
    const doc = await col.findOne({ _id: DOC_ID });
    if (!doc || !doc.files) {
      console.log('No saved session found in MongoDB — will pair fresh.');
      return;
    }

    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    for (const [filename, base64Content] of Object.entries(doc.files)) {
      fs.writeFileSync(path.join(SESSION_DIR, filename), Buffer.from(base64Content, 'base64'));
    }

    console.log(`✅ Session restored from MongoDB (${Object.keys(doc.files).length} files).`);
  } catch (err) {
    console.log('❌ Failed to restore session from MongoDB:', err.message);
  }
}

async function uploadSession() {
  const col = await getCollection();
  if (!col) return;

  try {
    if (!fs.existsSync(SESSION_DIR)) return;

    const files = {};
    for (const filename of fs.readdirSync(SESSION_DIR)) {
      const filePath = path.join(SESSION_DIR, filename);
      if (fs.statSync(filePath).isFile()) {
        files[filename] = fs.readFileSync(filePath).toString('base64');
      }
    }

    await col.updateOne(
      { _id: DOC_ID },
      { $set: { files, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (err) {
    console.log('❌ Failed to save session to MongoDB:', err.message);
  }
}

module.exports = { downloadSession, uploadSession };
