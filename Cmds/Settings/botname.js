const Heroku = require('heroku-client');

module.exports = async (context) => {
    const { m, text, herokuapikey, herokuAppname } = context;

    if (!herokuapikey || !herokuAppname) {
        return m.reply("𓆩🔮𓆪 *[𝐓𝐇𝐄 𝐂𝐎𝐑𝐄 𝐈𝐒 𝐔𝐍𝐁𝐎𝐔𝐍𝐃]* 𓆩🔮𓆪\n\n☠️ 𝘛𝘩𝘪𝘴 𝘳𝘪𝘵𝘶𝘢𝘭 𝘳𝘦𝘲𝘶𝘪𝘳𝘦𝘴 𝘢 𝘣𝘰𝘶𝘯𝘥 𝘥𝘦𝘱𝘭𝘰𝘺𝘮𝘦𝘯𝘵 𝘷𝘦𝘴𝘴𝘦𝘭 𝘢𝘯𝘥 𝘢 𝘴𝘦𝘢𝘭𝘦𝘥 𝘒𝘦𝘺.\n𝘕𝘰 𝘷𝘦𝘴𝘴𝘦𝘭 𝘥𝘦𝘵𝘦𝘤𝘵𝘦𝘥.");
    }

    if (!text) {
        return m.reply(
            "𓆩🔮𓆪 *[𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓 𝐃𝐄𝐂𝐑𝐄𝐄]* 𓆩🔮𓆪\n\n𝐒𝐭𝐚𝐭𝐞 𝐭𝐡𝐞 𝐭𝐚𝐫𝐠𝐞𝐭 𝐤𝐞𝐲 𝐚𝐧𝐝 𝐭𝐡𝐞 𝐯𝐚𝐥𝐮𝐞 𝐭𝐨 𝐛𝐢𝐧𝐝.\n\n" +
            "⚔️ *Multi-Assignment:* `.setvar PREFIX = .`\n" +
            "⚔️ *Quick-Format:* `.setvar Shadow Sovereign` _(maps to BOTNAME)_"
        );
    }

    const input = text.split('=');
    let key, value;

    if (input.length === 1) {
        key = 'BOTNAME';
        value = input[0].trim();
    } else if (input.length === 2) {
        key = input[0].trim();
        value = input[1].trim();
    } else {
        return m.reply(
            "𓆩❌𓆪 *[𝐌𝐀𝐋𝐅𝐎𝐑𝐌𝐄𝐃 𝐃𝐄𝐂𝐑𝐄𝐄]* 𓆩❌𓆪\n\n" +
            "✨ *Correct Form:* \n" +
            "🔹 `.setvar ANTILINK = true`\n" +
            "🔹 `.setvar BOTNAME = MLTN-MD`"
        );
    }

    key = key.toUpperCase();

    if (!value) {
        return m.reply(`𓆩❌𓆪 *[𝐄𝐌𝐏𝐓𝐘 𝐎𝐅𝐅𝐄𝐑𝐈𝐍𝐆]* 𓆩❌𓆪\n\nThe value bound to *${key}* cannot be nothing.`);
    }

    try {
        if (context.client && m.chat) {
            await context.client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        }
    } catch (e) {
        console.error("Failed to send reaction:", e.message);
    }

    const herok = new Heroku({ token: herokuapikey });
    const baseURI = `/apps/${herokuAppname}/config-vars`;

    try {
        await herok.patch(baseURI, {
            body: {
                [key]: value,
            },
        });

        const updateManifest = `𓆩⚙️𓆪 *[𝐒𝐘𝐒𝐓𝐄𝐌 𝐑𝐄𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐄𝐃]* 𓆩⚙️𓆪\n\n` +
                               `🔹 *Key:* ${key}\n` +
                               `🟢 *Value:* \`${value}\`\n\n` +
                               `🔄 𝘛𝘩𝘦 𝘳𝘦𝘢𝘭𝘮 𝘴𝘩𝘪𝘧𝘵𝘴. 𝘛𝘩𝘦 𝘷𝘦𝘴𝘴𝘦𝘭 𝘸𝘪𝘭𝘭 𝘣𝘳𝘪𝘦𝘧𝘭𝘺 𝘨𝘰 𝘴𝘪𝘭𝘦𝘯𝘵 𝘸𝘩𝘪𝘭𝘦 𝘪𝘵 𝘳𝘦𝘢𝘸𝘢𝘬𝘦𝘯𝘴...`;

        await m.reply(updateManifest.trim());

    } catch (error) {
        console.error('Fatal Heroku API patch exception encountered:', error);
        await m.reply(
            `𓆩💀𓆪 *[𝐕𝐄𝐒𝐒𝐄𝐋 𝐑𝐄𝐉𝐄𝐂𝐓𝐄𝐃]* 𓆩💀𓆪\n\n\`\`\`${error.message || error}\`\`\``
        );
    }
};