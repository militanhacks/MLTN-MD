// Run this manually from your own computer (not deployed with the bots).
// Usage:
//   MONGODB_URI="your_connection_string" node cleanupStaleSessions.js
//     -> lists all bot sessions and flags stale ones (no activity in 20+ days)
//   MONGODB_URI="your_connection_string" node cleanupStaleSessions.js --delete
//     -> also deletes the stale ones

const { MongoClient } = require('mongodb');

const DB_NAME = 'mltn_md';
const COLLECTION_NAME = 'sessions';
const STALE_DAYS = 20; // consider a bot "gone" if its session hasn't updated in this many days

async function cleanup() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('Set MONGODB_URI first, e.g.:');
    console.log('MONGODB_URI="mongodb+srv://..." node cleanupStaleSessions.js');
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);

  const allDocs = await collection
    .find({}, { projection: { _id: 1, updatedAt: 1 } })
    .toArray();

  if (allDocs.length === 0) {
    console.log('No bot sessions found in this cluster.');
    await client.close();
    return;
  }

  console.log(`Found ${allDocs.length} bot session(s):\n`);

  const stale = [];
  for (const doc of allDocs) {
    const updated = doc.updatedAt ? new Date(doc.updatedAt) : null;
    const ageDays = updated ? Math.floor((Date.now() - updated.getTime()) / 86400000) : 'unknown';
    console.log(`- ${doc._id}  |  last active: ${updated ? updated.toISOString() : 'never'}  (${ageDays} days ago)`);

    if (updated && updated < cutoff) {
      stale.push(doc._id);
    }
  }

  if (stale.length === 0) {
    console.log(`\nNo stale sessions (none older than ${STALE_DAYS} days). Nothing to clean up.`);
    await client.close();
    return;
  }

  console.log(`\n${stale.length} session(s) look abandoned (no activity in ${STALE_DAYS}+ days):`);
  stale.forEach((id) => console.log(`  - ${id}`));

  if (process.argv.includes('--delete')) {
    for (const id of stale) {
      await collection.deleteOne({ _id: id });
      console.log(`Deleted: ${id}`);
    }
  } else {
    console.log('\nThis was just a check — nothing was deleted.');
    console.log('Re-run with --delete at the end to actually remove these.');
  }

  await client.close();
}

cleanup();
