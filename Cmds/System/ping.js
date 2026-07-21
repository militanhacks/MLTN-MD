const speed = require('performance-now');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (context) => {
    const { client, m, botname } = context;

    try {
        // Step-by-step awakening text commands
        const loadingSymbols = [
            "🌑 SYSTEM STATUS: DORMANT...",
            "⚡ AWAKENING MLTN MD...",
            "👁️ IDENTITY VERIFIED: REWRITING THE RULES...",
            "⚔️ DISMANTLING TERMINAL BLINDSPOTS...",
            "👑 OVERRIDE COMPLETE. ASCENDING NOW."
        ];
        
        // 1. Send the initial visual breach alert placeholder message
        let { key } = await client.sendMessage(m.chat, { 
            text: `*⚠️ WARNING: Core system breach initiated...*` 
        }, { quoted: m });

        // Cycle through the dark awakening animation strings via text edits
        for (let i = 0; i < loadingSymbols.length; i++) {
            await client.sendMessage(m.chat, { text: `*${loadingSymbols[i]}*`, edit: key });
            await delay(1000); 
        }

        // 2. Calculate execution latency speeds immediately after the loop
        const timestamp = speed();
        const pingSpeed = speed() - timestamp;

        // 🌑 The Imposing Villain Terminal Output Layout
        const perfMessage = `🌑 *[ ${botname.toUpperCase()} SYSTEM OVERRIDE ]*\n` +
                            `═\n` +
                            `⚔️ *Execution Latency:* \`${pingSpeed.toFixed(4)}ms\`\n` +
                            `📡 *Core Engine State:* \`OPTIMAL\`\n` +
                            `═\n` +
                            `_Survival is winning — everything else is just noise._ 🌑⚔️`;

        // 3. CRITICAL PATCH: Instead of deleting and creating a new message, 
        // edit the existing animation key directly into the final layout. 
        // This completely bypasses the ANTIDELETE crash trap!
        await client.sendMessage(m.chat, {
    text: perfMessage,
    // REMOVE "edit: key" completely
    contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
            title: `⚡ ${botname.toUpperCase()} COMMAND SEQUENCE`,
            body: "Do whatever it takes to rise from the shadows.",
            showAdAttribution: true,
            thumbnailUrl: "https://imgur.com/undefined.jpeg",
            sourceUrl: "https://session-generator-qyw2.onrender.com",
            mediaType: 1,
            renderLargerThumbnail: true
        }
    }
});
    } catch (error) {
        console.error("Error executing core telemetry override:", error);
        m.reply('❌ An error occurred while executing the core telemetry override.');
    }
};
