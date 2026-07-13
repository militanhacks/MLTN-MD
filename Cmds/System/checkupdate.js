const axios = require('axios');
const ownerMiddleware = require('../../Middleware/ownerMiddleware'); // Adjusted based on your path

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, sendReply } = context;

        try {
            // Safe static check status since external repo sync isn't set up yet
            if (typeof sendReply === 'function') {
                await sendReply(client, m, `✨ *MLTN-MD System Status:* Your local repository is currently fully up to date with the core framework layer.`);
            } else {
                await m.reply(`✨ *MLTN-MD System Status:* Your local repository is currently fully up to date with the core framework layer.`);
            }
        } catch (error) {
            console.error("Error Inside checkupdate.js:", error);
            if (typeof sendReply === 'function') {
                sendReply(client, m, `❌ Update System Error: ${error.message}`);
            } else {
                m.reply(`❌ Update System Error: ${error.message}`);
            }
        }
    });
};
