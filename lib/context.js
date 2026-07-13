module.exports = {
    getContextInfo: (m) => {
        return {
            mentionedJid: [m.sender]
        };
    },

    sendReply: async (client, m, text) => {
        const contextInfo = module.exports.getContextInfo(m); 
        await client.sendMessage(m.chat, { 
            text: text, 
            contextInfo: contextInfo 
        });
    },

    sendMediaMessage: async (client, m, options) => {
        const contextInfo = module.exports.getContextInfo(m); 
        await client.sendMessage(m.chat, { 
            ...options, 
            contextInfo: contextInfo 
        });
    }
};