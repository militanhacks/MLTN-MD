const { DateTime } = require('luxon');
const fs = require('fs');

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix, url, sendReply, sendMediaMessage, gurl, author } = context;

    try {
        const categories = [
            { name: 'Ai', emoji: '☠️' },
            { name: 'General', emoji: '⚔️' },
            { name: 'Media', emoji: '🎭' },
            { name: 'Search', emoji: '🔮' },
            { name: 'Editting', emoji: '🖤' },
            { name: 'Groups', emoji: '👑' },
            { name: 'Fun', emoji: '🔥' },
            { name: 'Owner', emoji: '⛓️' },
            { name: 'Coding', emoji: '💀' },
            { name: 'Utility', emoji: '🗡️' },
            { name: 'Statistics', emoji: '📊' },
            { name: 'Settings', emoji: '⚙️' },
            { name: 'System', emoji: '🌑' },
            { name: 'Stalk', emoji: '👁️' }
        ];

        // Villain monologue lines — hits different every time
        const villainLines = [
            "Power is not given. It is taken from those too weak to hold it.",
            "I don't beg the shadows to obey. I command them.",
            "Every kingdom falls. I simply arrive first to watch.",
            "Mercy is a debt I stopped paying long ago.",
            "The weak kneel. The strong don't ask permission.",
            "I wasn't born a monster. The world just ran out of heroes.",
            "Fear isn't given to me — I hand it out.",
            "The throne was empty, so I took it. Simple as that.",
            "You call it destruction. I call it clearing the path.",
            "Loyalty is bought. Fear is earned. I collect both.",
            "There is no villain in my story — only the ones who got in my way.",
            "I don't chase power. Power learns to follow me.",
            "Even monarchs bleed. I just make sure it's never mine.",
            "The shadows don't fear me. We're the same thing.",
            "I stopped asking for a seat at the table. I flipped it instead.",
            "Every hunter starts weak. I simply never stayed that way.",
            "You survive by hiding. I survive by making them hide from me.",
            "The system doesn't beg. It commands.",
            "I don't need an army. I need one moment of hesitation from my enemy.",
            "Ashes remember who lit the fire."
        ];

        // Get greeting based on the time of day — villain edition
        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
            if (currentHour >= 5 && currentHour < 12) return 'The sun rises, but my shadow never sleeps 🌅';
            if (currentHour >= 12 && currentHour < 18) return 'High noon — even the light bows to me ☀️';
            if (currentHour >= 18 && currentHour < 22) return 'Dusk falls, the hunt begins 🌆';
            return 'The night is mine. Sleep well, mortal 🌑';
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        const getRandomVillainLine = () => {
            const randomIndex = Math.floor(Math.random() * villainLines.length);
            return villainLines[randomIndex];
        };

        let menuText = `╭──「 ⛧ *ARISE* ⛧ 」──╮\n`;
        menuText += `*${getGreeting()}*\n`;
        menuText += `*Summoned by:* ${m.pushName}\n`;
        menuText += `╰────────────────╯\n\n`;

        // Villain monologue
        menuText += `🖤 *"${getRandomVillainLine()}"* 🖤\n\n`;

        // Status window
        menuText += `╭━━━  ⟮ ${botname} ⟯━━━┈⊷\n`;
        menuText += `┃☠╭──────────────\n`;
        menuText += `┃☠│ 👑 ᴍᴏɴᴀʀᴄʜ: ${m.pushName}\n`;
        menuText += `┃☠│ ⚔️ ᴀʀsᴇɴᴀʟ: ${totalCommands}\n`;
        menuText += `┃☠│ 🌑 ᴛɪᴍᴇ ɢᴀᴛᴇ: ${getCurrentTimeInNairobi()}\n`;
        menuText += `┃☠│ 🗝️ sɪɢɪʟ: ${prefix}\n`;
        menuText += `┃☠│ 🔮 ʀᴀɴᴋ: ${mode}\n`;
        menuText += `┃☠│ 📚 ʟɪʙʀᴀʀʏ: Baileys\n`;
        menuText += `┃☠╰──────────────\n`;
        menuText += `╰━━━━━━━━━━━━━━━┈⊷\n\n`;

        menuText += '⛓️┃⛓️┃⛓️┃⛓️┃⛓️┃⛓️┃⛓️┃⛓️\n\n';

        // Fancy uppercase font
        const toFancyUppercaseFont = (text) => {
            const fonts = {
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
                'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        // Fancy lowercase font
        const toFancyLowercaseFont = (text) => {
            const fonts = {
                "a": "ᴀ", "b": "ʙ", "c": "ᴄ", "d": "ᴅ", "e": "ᴇ", "f": "ꜰ", "g": "ɢ", "h": "ʜ", "i": "ɪ", "j": "ᴊ", "k": "ᴋ", "l": "ʟ", "m": "ᴍ",
                "n": "ɴ", "o": "ᴏ", "p": "ᴘ", "q": "ϙ", "r": "ʀ", "s": "ꜱ", "t": "ᴛ", "u": "ᴜ", "v": "ᴠ", "w": "ᴡ", "x": "x", "y": "ʏ", "z": "ᴢ"
            };
            return text.split('').map(char => fonts[char.toUpperCase()] || fonts[char] || char).join('');
        };

        let commandCounter = 1;

        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Cmds/${category.name}`).filter((file) => file.endsWith('.js'));
            const fancyCategory = toFancyUppercaseFont(category.name.toUpperCase());

            menuText += ` ╭─「 ${fancyCategory} ${category.emoji} 」───┈⊷ \n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toFancyLowercaseFont(commandName);
                menuText += ` ││➛  ${commandCounter}. ${fancyCommandName}\n`;
                commandCounter++;
            }
            menuText += ' ╰──────────────┈⊷ \n';
        }

        menuText += `\n💀 *"The gate is open. Enter if you dare."* 💀`;

        // Developer vCard — change the number to whichever should show
        const developerVCard = `BEGIN:VCARD\nVERSION:3.0\nFN:${author}\nTEL;type=CELL;type=VOICE;waid=254713421283:+254713421283\nEND:VCARD`;

        try {
            await sendMediaMessage(client, m, {
                text: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: botname,
                        body: author,
                        thumbnailUrl: url,
                        sourceUrl: gurl,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });

            // Send the developer's contact card
            await client.sendMessage(m.key.remoteJid, {
                contacts: {
                    displayName: author,
                    contacts: [{ vcard: developerVCard }]
                }
            });

            // Villain-flavored "message the dev" note
            await client.sendMessage(m.key.remoteJid, {
                text: `⛓️ *Lost? Broken? Confused?*\n☠️ The Monarch behind this system answers to no one — but message the developer above if the shadows glitch on you.`
            });

        } catch (error) {
            console.error("Error sending message:", error);
            sendReply(client, m, '🌑 The ritual failed. Try summoning the menu again.');
        }

    } catch (error) {
        console.error("Error:", error);
        sendReply(client, m, '💀 Something broke in the shadow realm: ' + error);
    }
};