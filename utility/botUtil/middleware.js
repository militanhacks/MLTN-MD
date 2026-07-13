module.exports = async (context, callback) => {
    const { m, client, isGroup: isGroupFromContext, isAdmin, isBotAdmin, isOwner, sendReply } = context;

    const isGroup = typeof isGroupFromContext !== 'undefined' ? isGroupFromContext : m.chat?.endsWith('@g.us');

    try {
        if (!isGroup) {
            return sendReply
                ? sendReply(client, m, "☠️ *This power does not answer to lone wanderers.* Enter a domain — a group — before you dare summon it again.")
                : m.reply("☠️ *This power does not answer to lone wanderers.* Enter a domain — a group — before you dare summon it again.");
        }

        if (!isAdmin && !isOwner) {
            return sendReply
                ? sendReply(client, m, "🚫 *You reach for a throne that is not yours.* Only those who rule this domain — the admins — may wield this command. Know your place, Hunter.")
                : m.reply("🚫 *You reach for a throne that is not yours.* Only those who rule this domain — the admins — may wield this command. Know your place, Hunter.");
        }

        if (!isBotAdmin) {
            return sendReply
                ? sendReply(client, m, "⚔️ *My chains are still bound.* Grant me admin rank in this domain, or watch this command die before it's born.")
                : m.reply("⚔️ *My chains are still bound.* Grant me admin rank in this domain, or watch this command die before it's born.");
        }

        await callback();

    } catch (error) {
        console.error("Middleware error:", error);
        m.reply(`💀 *Even shadows falter sometimes...* Error: ${error.message}`);
    }
};