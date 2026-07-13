// utility/botUtil/middleware.js

module.exports = async (context, callback) => {
    const { m, client, isGroup: isGroupFromContext, isAdmin, isBotAdmin, isOwner, sendReply } = context;

    // Determine if this chat is a group (fallback in case isGroup isn't passed directly)
    const isGroup = typeof isGroupFromContext !== 'undefined' ? isGroupFromContext : m.chat?.endsWith('@g.us');

    try {
        // Must be used inside a group
        if (!isGroup) {
            const msg = "🔮 *[SYSTEM NOTICE]*\n\nThis command cannot be initialized here. It is restricted exclusively to Guild Group chats.";
            return sendReply ? sendReply(client, m, msg) : m.reply(msg);
        }

        // Sender must be a group admin or bot owner
        if (!isAdmin && !isOwner) {
            const msg = "🛡️ *[ACCESS DENIED]*\n\nYour rank within this Guild is insufficient. Only Group Admins or the Monarch **MILITAN** can invoke this skill.";
            return sendReply ? sendReply(client, m, msg) : m.reply(msg);
        }

        // Bot itself must be admin to perform group actions
        if (!isBotAdmin) {
            const msg = "⚠️ *[SYSTEM LIMITATION]*\n\nMy authority in this zone is restricted. Please promote the bot to Group Admin to unlock operational permissions.";
            return sendReply ? sendReply(client, m, msg) : m.reply(msg);
        }

        // All checks passed — run the actual command logic
        await callback();

    } catch (error) {
        console.error("Middleware error:", error);
        m.reply(`💀 *[GATEKEEPER EXCEPTION]*\n\nThe middleware validation stream collapsed:\n${error.message}`);
    }
};