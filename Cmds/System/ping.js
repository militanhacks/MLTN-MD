
const speed = require('performance-now'); // Keeps your system speed tracking intact

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ⏳ The Advanced System Awakening Animation
async function loading(m, client) {
    // Step-by-step awakening text commands
    const loadingSymbols = [
        "🌑 SYSTEM STATUS: DORMANT...",
        "⚡ AWAKENING MLTN MD...",
        "👁️ IDENTITY VERIFIED: REWRITING THE RULES...",
        "⚔️ DISMANTLING TERMINAL BLINDSPOTS...",
        "👑 OVERRIDE COMPLETE. ASCENDING NOW."
    ];
    
    // The very first cool introduction text that pops up
    let { key } = await client.sendMessage(m.chat, { text: `*⚠️ WARNING: Core system breach initiated...*` });

    // Cycle through the dark awakening animation strings
    for (let i = 0; i < loadingSymbols.length; i++) {
        await client.sendMessage(m.chat, { text: `*${loadingSymbols[i]}*`, edit: key });
        await delay(1000); // Wait 1 second between each stage so users can actually read it
    }

    // Completely deletes the loading sequence from the chat right before the final results drop!
    await client.sendMessage(m.chat, { delete: key });
}

module.exports = async (context) => {
    const { client, m, botname, author } = context;

    try {
        // Trigger the awakening sequence first
        await loading(m, client);

        // Calculate the execution latency speeds
        const timestamp = speed();
        const pingSpeed = speed() - timestamp;

        // 🌑 The Imposing Villain Terminal Output Layout
        const perfMessage = `🌑 *[ ${botname.toUpperCase()} SYSTEM OVERRIDE ]*\n` +
                            `═\n` +
                            `⚔️ *Execution Latency:* \`${pingSpeed.toFixed(4)}ms\`\n` +
                            `📡 *Core Engine State:* \`OPTIMAL\`\n` +
                            `═\n` +
                            `_Survival is winning — everything else is just noise._ 🌑⚔️`;

        // 🚀 Elite Context Card with the large Render Banner
        await client.sendMessage(m.chat, {
            text: perfMessage,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: `⚡ ${botname.toUpperCase()} COMMAND SEQUENCE`,
                    body: "Do whatever it takes to rise from the shadows.",
                    showAdAttribution: true, // Injects the verified system arrow badge
                    thumbnailUrl: "https://i.imgur.com/XlQIFIF.jpeg", // Pulls your clean visual banner
                    sourceUrl: "https://session-generator-qyw2.onrender.com", // Your custom live link
                    mediaType: 1,
                    renderLargerThumbnail: true // Spreads the image across the entire header beautifully
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error("Error sending message:", error);
        m.reply('An error occurred while executing the core telemetry override.');
    }
};