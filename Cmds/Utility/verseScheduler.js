const { DateTime } = require('luxon');
const { dev } = require('../../settings'); // owner number array, already parsed in settings.js

// Times to send verses (24hr format, Africa/Nairobi timezone)
const SEND_TIMES = ['08:00', '14:00', '20:00'];

// Track which times we've already sent today, to avoid duplicate sends
let sentToday = {};

async function fetchRandomVerse() {
    const response = await fetch('https://bible-api.com/?random=verse&translation=kjv');
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    if (!data?.reference) throw new Error('Invalid random verse response');
    return data;
}

function formatVerseMessage(data) {
    return `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n` +
           `📜  *𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐌𝐃  𝐃𝐀𝐈𝐋𝐘  𝐒𝐂𝐑𝐈𝐏𝐓𝐔𝐑𝐄*  📜\n` +
           `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n\n` +
           `📖 *REFERENCE:* ${data.reference}\n` +
           `📚 *TRANSLATION:* ${data.translation_name}\n\n` +
           `💬 *─── TEXT CHRONICLE ───*\n\n` +
           `*${data.text.trim()}*\n\n` +
           `📡 *DATABASE LINK:* MILITAN Engine Core`;
}

function startVerseScheduler(client) {
    const ownerJid = dev[0].includes('@') ? dev[0] : `${dev[0]}@s.whatsapp.net`;

    // Reset the "sent today" tracker at midnight
    setInterval(() => {
        const now = DateTime.now().setZone('Africa/Nairobi');
        if (now.hour === 0 && now.minute === 0) {
            sentToday = {};
        }
    }, 60 * 1000);

    // Check every minute if it's time to send
    setInterval(async () => {
        const now = DateTime.now().setZone('Africa/Nairobi');
        const currentTime = now.toFormat('HH:mm');

        if (SEND_TIMES.includes(currentTime) && !sentToday[currentTime]) {
            sentToday[currentTime] = true;
            try {
                const verseData = await fetchRandomVerse();
                await client.sendMessage(ownerJid, { text: formatVerseMessage(verseData) });
                console.log(`✅ Sent scheduled verse at ${currentTime}`);
            } catch (error) {
                console.error('Scheduled verse error:', error.message);
            }
        }
    }, 60 * 1000);

    console.log(`📖 Verse scheduler started — sending to owner at: ${SEND_TIMES.join(', ')} (Africa/Nairobi)`);
}

module.exports = { startVerseScheduler };