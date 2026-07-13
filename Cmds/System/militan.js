module.exports = async (context) => {
    const { m } = context;

    try {
        let str = `🌌 ───『 **𝙴𝙽𝚅𝙸𝚁𝙾𝙽𝙼𝙴𝙽𝚃  𝚁𝙴𝙰𝙻𝙼** 』─── 🌌\n\n`;
        str += `"𝘛𝘩𝘦 𝘚𝘰𝘷𝘦𝘳𝘦𝘪𝘨𝘯 𝘯𝘦𝘦𝘥𝘴 𝘯𝘰 𝘥𝘪𝘴𝘵𝘳𝘪𝘣𝘶𝘵𝘦𝘥 𝘤𝘭𝘰𝘶𝘥 𝘵𝘰 𝘮𝘢𝘪𝘯𝘵𝘢𝘪𝘯 𝘥𝘰𝘮𝘪𝘯𝘪𝘰𝘯."\n\n`;
        
        str += `⚙️ **[ SYSTEM VARIABLES ]**\n`;
        str += `├─📡 **Host Connection:** Active\n`;
        str += `├─🔒 **Security Layer:** Sovereign Encrypted\n`;
        str += `├─📦 **Core Engine:** MILITAN-MD\n`;
        str += `└─⚡ **Cloud Dependency:** Zero (Pure Local Session)\n\n`;
        
        str += `*Status:* All systems are operating locally under absolute authority.`;

        await m.reply(str);

    } catch (error) {
        console.error('Error loading environment realm:', error);
        await m.reply('🚫 *THE REALM IS UNSTABLE* 🚫\n\nAn error occurred while inspecting the system variables.');
    }
};
