const ownerMiddleware = require('../../utility/botUtil/OwnerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, author } = context;

        await m.reply(`
🌌 ───『 **𝚂𝚈𝚂𝚃𝙴𝙼  𝙼𝙰𝙸𝙽𝚃𝙴𝙽𝙰𝙽𝙲𝙴** 』─── 🌌

   "𝘛𝘩𝘦𝘳𝘦 𝘪𝘴 𝘯𝘰 𝘯𝘦𝘦𝘥 𝘧𝘰𝘳 𝘢𝘶𝘵ом𝘢𝘵𝘦𝘥 𝘨𝘰𝘷𝘦𝘳𝘯𝘢𝘯𝘤𝘦. 𝘐 𝘢𝘭𝘰𝘯𝘦 𝘥𝘦𝘤𝘪𝘥𝘦 𝘸𝘩𝘦𝘯 𝘵𝘩𝘦 𝘸𝘰𝘳𝘭𝘥 𝘤𝘢𝘯𝘨𝘦𝘴."

👤 **[ 𝙳𝙴𝙿𝙻𝙾𝚈𝙴𝚁 ]**
├─👑 **Authority:** \${author}
└─🛡️ **Access:** Sovereign Control Only

⚙️ **[ 𝚂𝚃𝙰𝚃𝚄𝚂 ]**
├─📦 **Deployment Mode:** Manual Override
├─🚀 **Hosting:** Direct Host // Private Session
└─⚡ **Core Engine:** MLTN-MD Locked

  "Automated updates disabled. System is fully stabilized under my command."
`);
    });
};