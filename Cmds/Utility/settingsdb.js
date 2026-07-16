const { Database } = require('quickmongo');

// The Vault — where the Monarch's decrees are kept, unshaken by restarts
let db;
let ready = false;

async function initDB() {
    if (!process.env.MONGODB_URI) {
        console.log('🌑 No vault key found (MONGODB_URI missing) — the Monarch\'s decrees will fade with every restart.');
        return;
    }
    try {
        db = new Database(process.env.MONGODB_URI);
        await db.connect();
        ready = true;
        console.log('⛓️  The Vault has opened. Decrees set with .setvar now hold — no restart shall erase them.');
    } catch (err) {
        console.error('💀 The Vault refused entry:', err.message);
    }
}

// Consult the Vault for a decree; if none exists, fall back to the old law (.env default)
async function getSetting(key, fallback) {
    if (!ready) return fallback;
    try {
        const val = await db.get(key);
        return (val !== undefined && val !== null) ? val : fallback;
    } catch (err) {
        console.error(`👁️  The Vault would not yield "${key}":`, err.message);
        return fallback;
    }
}

// Carve a new decree into the Vault
async function setSetting(key, value) {
    if (!ready) {
        throw new Error('⛔ The Vault is sealed — no MONGODB_URI. This decree cannot be made permanent.');
    }
    await db.set(key, value);
    return true;
}

module.exports = { initDB, getSetting, setSetting };