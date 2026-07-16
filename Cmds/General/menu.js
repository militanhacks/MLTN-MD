const { DateTime } = require('luxon');
const fs = require('fs');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname = 'MLTN-MD', prefix = '.', sendReply, author = 'Sovereign' } = context;

    try {
        const categories = [
            { name: 'AI', emoji: '」' },
            { name: 'Bugs', emoji: '」' },
            { name: 'General', emoji: '」' },
            { name: 'Media', emoji: '」' },
            { name: 'Search', emoji: '」' },
            { name: 'Editting', emoji: '」' },
            { name: 'Groups', emoji: '」' },
            { name: 'Fun', emoji: '」' },
            { name: 'Owner', emoji: '」' },
            { name: 'Coding', emoji: '」' },
            { name: 'Settings', emoji: '」' },
            { name: 'Statistics', emoji: '」' },
            { name: 'Newsletter-Channel', emoji: '」' }, 
            { name: 'Utility', emoji: '」' },
            { name: 'System', emoji: '」' }
        ];

        const quotes = [
            "Dream big, work hard.",
            "Stay humble, hustle hard.",
            "Believe in yourself.",
            "Success is earned, not given.",
            "Actions speak louder than words."
        ];

        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
            if (currentHour >= 5 && currentHour < 12) return 'Ohayou Gozaimasu! Morning Vanguard 🌅⚔️';
            if (currentHour >= 12 && currentHour < 18) return 'Konnichiwa! Afternoon Arise ☀️💮';
            if (currentHour >= 18 && currentHour < 22) return 'Konbanwa! Evening Shadow 🌆⛩️';
            return 'Oyasumi Nasai! Sleep well in the System 😴💤';
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

        // 🌟 BUILD THE TEXT DATA
        let menuText = `╭─❍͙۪۫ ⋆ ❍͙۪۫─╮\n`;
        menuText += `   ⛩️ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐌𝐘 𝐃𝐈𝐌𝐄𝐍𝐒𝐈𝐎𝐍 👺\n`;
        menuText += `   ${getGreeting()}, ${m.pushName || 'Hunter'}\n`;
        menuText += `╰─❍͙۪۫ ⋆ ❍͙۪۫─╯\n\n`;

        menuText += `『 ☠️ 𝐁𝐀𝐍𝐊𝐀𝐀 ☠️ 』\n`;
        menuText += `❝ ${getRandomQuote()} ❞\n\n`;

        menuText += `╭━━━〔 "${botname}" 〕━━━╮\n`;
        menuText += `┃ 👑 HUNTER      : ${m.pushName || 'User'}\n`;
        menuText += `┃ ⚔️ ARISE COUNT : ${totalCommands || 0}\n`;
        menuText += `┃ ⏰ ARISE TIME   : ${getCurrentTimeInNairobi()}\n`;
        menuText += `┃ 🗡️ SYSTEM CMD  : ${prefix}\n`;
        menuText += `┃ 🌑 SHADOW MODE : ${mode || 'Public'}\n`;
        menuText += `┃ 📜 MONARCH LIB : Baileys\n`;
        menuText += `╰━━━━━━━━━━━━━━━━━╯\n\n`;

        const toFancyUppercaseFont = (text) => {
            const fonts = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
                'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐛'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toFancyLowercaseFont = (text) => {
            const fonts = {
                "a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ꜰ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ", "k": "ᴋ", "l": "ʟ", "m": "ᴍ", 
                "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ϙ", "r": "ʀ", "s": "ꜱ", "t": "ᴛ", "u": "ᴜ", "v": "ᴠ", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ"
            };
            return text.split('').map(char => fonts[char.toUpperCase()] || fonts[char] || char).join('');
        };

        let commandCounter = 1;

        // Auto-detect base folder casing
        const baseFolder = fs.existsSync('./Cmds') ? './Cmds' : './cmds';

        for (const category of categories) {
            let dirPath = `${baseFolder}/${category.name}`;
            if (!fs.existsSync(dirPath)) {
                dirPath = `${baseFolder}/${category.name.toLowerCase()}`;
            }
            if (!fs.existsSync(dirPath)) continue; 

            const commandFiles = fs.readdirSync(dirPath).filter((file) => file.endsWith('.js'));
            const fancyCategory = toFancyUppercaseFont(category.name.toUpperCase());

            menuText += `\n≪ ${fancyCategory} ${category.emoji} ≫\n`;
            menuText += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toFancyLowercaseFont(commandName);
                menuText += `   ⛧ ${commandCounter}. ${prefix}${fancyCommandName}\n`;
                commandCounter++;
            }
            menuText += `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
        }

       // 🌟 System Awakening loading animation, then edit into the full menu
        const loadingText = `⚡ *[ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐖𝐀𝐊𝐄𝐍𝐈𝐍𝐆 ]* ⚡\n\n🌑 𝘛𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴 𝘴𝘵𝘪𝘳...\n👁️ 𝘔𝘢𝘱𝘱𝘪𝘯𝘨 𝘵𝘩𝘦 𝘴𝘺𝘴𝘵𝘦𝘮'𝘴 𝘢𝘳𝘴𝘦𝘯𝘢𝘭...`;

        const { key } = await client.sendMessage(m.chat, { text: loadingText }, { quoted: m });

        await new Promise(resolve => setTimeout(resolve, 3000));

        await client.sendMessage(m.chat, {
            text: menuText,
            edit: key,
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });

    } catch (error) {
        console.error("Error Inside menu.js:", error);
        if (typeof sendReply === 'function') {
            sendReply(client, m, `❌ *System Synchronization Error:* ${error.message}`);
        } else {
            m.reply(`❌ *System Synchronization Error:* ${error.message}`);
        }
    }
};