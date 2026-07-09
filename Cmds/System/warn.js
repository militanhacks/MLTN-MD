const { addUserWithWarnCount, getWarnCountByJID, resetWarnCountByJID } = require(__dirname + "/../../lib/warn");
const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, text, args } = context;

        // Check if the message is quoted or mentioned
        if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
            m.reply('🚫 *JUDGEMENT REQUIRES A TARGET* 🚫\n\nYou must reply to a user with ".warn" to issue a strike, or ".warn reset" to clear their slate.');
            return;
        }

        const authorReplied = m.quoted ? m.quoted.participant : m.mentionedJid[0];
        const warnLimit = 3;

        if (!args.length || args.join('') === '') {
            await addUserWithWarnCount(authorReplied);
            let warn = await getWarnCountByJID(authorReplied);

            if (warn >= warnLimit) {
                await client.sendMessage(m.chat, { text: '💀 *THE JUDGEMENT HAS BEEN DELIVERED* 💀\n\nThis insolent creature has ignored too many warnings. Their presence in this realm is now void. *TERMINATING STATUS.*', quoted: m });
                await client.groupParticipantsUpdate(m.chat, [authorReplied], "remove");
            } else {
                const remaining = warnLimit - warn;
                await client.sendMessage(m.chat, { text: `🛡️ *THE SOVEREIGN WATCHES* 🛡️\n\nA strike has been registered against you, @${authorReplied.split('@')[0]}. You have tested my patience.\n\n💥 *Strike Level:* [ ${warn} / ${warnLimit} ]\n⚠️ *Final Mercy remaining:* [ ${remaining} ]\n\n_Do not force my hand again._`, mentions: [authorReplied], quoted: m });
            }
        } else if (args[0] === 'reset') {
            await resetWarnCountByJID(authorReplied);
            m.reply(`✨ *THE OATH IS RENEWED* ✨\n\nMy Sovereign's mercy is absolute. The previous strikes against @${authorReplied.split('@')[0]} have been purged. Consider this a fresh start...\n_...but do not tempt fate a second time._`);
        } else {
            m.reply('🚫 *SYNTAX ERROR* 🚫\n\nYour commands must align with the Sovereign’s will. Use only ".warn" to judge, or ".warn reset" to pardon.');
        }
    });
};