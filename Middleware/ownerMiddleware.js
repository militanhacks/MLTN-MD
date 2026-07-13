module.exports = async (context, callback) => {
    const { m, isOwner, sendReply, client } = context;

    try {
        if (!isOwner) {
            return sendReply
                ? sendReply(client, m, "☠️ *[ACCESS DENIED]*\n\nThis throne answers to one voice alone. You are not the Monarch — turn back before the shadows notice you.")
                : m.reply("☠️ *[ACCESS DENIED]*\n\nThis throne answers to one voice alone. You are not the Monarch — turn back before the shadows notice you.");
        }

        await callback();

    } catch (error) {
        console.error("Owner middleware error:", error);
        m.reply(`💀 *[SYSTEM FRACTURE]*\n\nEven the strongest chains snap sometimes...\n\n${error.message}`);
    }
};