const Heroku = require('heroku-client');

module.exports = async (context) => {
    const { m, text, herokuapikey, herokuAppname } = context;

    // Check presence of API and Application infrastructure identifiers
    if (!herokuapikey || !herokuAppname) {
        return m.reply("🔮 *[CREDENTIALS ABSENT]*\n\nThis core utility requires a verified Heroku API Token and Application Name bound to the environment layer.");
    }

    if (!text) {
        return m.reply(
            "🔮 *[INSUFFICIENT PARAMETERS]*\n\nProvide the configuration var target key and assignment value.\n\n" +
            "⚔️ *Multi-Assignment Format:* `.setvar ANTIBOT = true`\n" +
            "⚔️ *Single-Value Quick-Format:* `.setvar true` _(Automatically maps to GREET)_"
        );
    }

    const input = text.split('=');
    let key, value;

    if (input.length === 1) {
        // Fallback target routing explicitly tied to this file's logic
        key = 'GREET';
        value = input[0].trim();
    } else if (input.length === 2) {
        // Sanitize and break down string payload bounds
        key = input[0].trim();
        value = input[1].trim();
    } else {
        return m.reply(
            "❌ *[SYNTAX REJECTION]*\n\nMalformed variable assignment parameters.\n\n" +
            "✨ *Correct Usage Example:* \n" +
            "🔹 `.setvar ANTILINK = true`\n" +
            "🔹 `.setvar GREET = true`"
        );
    }

    // Critical Patch: Enforce clean Upper Case normalization rules to match process.env bounds
    key = key.toUpperCase();

    if (!value) {
        return m.reply(`❌ *[VALIDATION ERROR]*\n\nAssignment target payload for key *${key}* cannot evaluate to a blank string array.`);
    }

    // Trigger processing loading reaction marker
    try {
        if (context.client && m.chat) {
            await context.client.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });
        }
    } catch (e) {
        console.error("Failed to send reaction:", e.message);
    }

    // Initialize Heroku wrapper instance
    const herok = new Heroku({ token: herokuapikey });
    const baseURI = `/apps/${herokuAppname}/config-vars`;

    try {
        // Inject update payload down into the Heroku platform routing gateway
        await herok.patch(baseURI, {
            body: {
                [key]: value,
            },
        });

        // Build premium terminal status prompt text layout
        const updateManifest = `⚙️ *[HEROKU INSTANCE CONFIG DOCK]* ⚙️\n\n` +
                               `🔹 *Variable Key Name:* ${key}\n` +
                               `🟢 *Assigned Value Status:* \`${value}\`\n\n` +
                               `🔄 *STATUS UPDATE SYSTEM NOTICE:* \n` +
                               `The upstream cluster accepted the parameters change. The dyno container has initialized a rolling container restart cycle. Bot will temporarily go offline...`;

        await m.reply(updateManifest.trim());

    } catch (error) {
        console.error('Fatal Heroku API patch exception encountered:', error);
        await m.reply(
            `💀 *[INFRASTRUCTURE REJECTION]*\n\nHeroku backend infrastructure rejected the mutation request payload:\n\n\`\`\`${error.message || error}\`\`\``
        );
    }
};