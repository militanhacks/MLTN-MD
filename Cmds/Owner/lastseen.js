const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        try {
            const privacyData = await client.fetchPrivacySettings(true).catch(() => null);
            if (!privacyData) {
                return m.reply("Couldn't fetch privacy settings.");
            }
            m.reply(`Privacy Settings:\n${JSON.stringify(privacyData, null, 2)}`);
        } catch (error) {
            console.error(error);
            m.reply("Something went wrong.");
        }
    });
};