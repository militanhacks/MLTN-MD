module.exports = async (context) => {
    const { client, m, text, sendReply, sendMediaMessage } = context;

    try {
        if (!text) {
            return await sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nPlease provide a valid GitHub target username.\n\n✨ *Format:* .github [username]\n⚡ *Example:* .github Torvalds");
        }

        // Trigger processing signal
        await client.sendMessage(m.chat, { react: { text: '💻', key: m.key } });

        const apiUrl = `https://api.github.com/users/${encodeURIComponent(text.trim())}`;
        
        // Fetch target account data via standard headers to avoid encoding rejections
        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'MILITAN-MD-Bot-Platform' }
        });
        
        // Explicitly isolate common GitHub API status errors
        if (response.status === 404) {
            return await sendReply(client, m, `🔍 *[USER ABSENT]*\n\nGitHub operator profile "${text.trim()}" could not be localized on the global network grid.`);
        }
        if (response.status === 403) {
            return await sendReply(client, m, `⚠️ *[API RATE LIMIT]*\n\nThe hosting terminal has exhausted its unauthenticated hourly pool requests on GitHub's gateway server cluster.`);
        }
        if (!response.ok) {
            throw new Error(`Upstream returned non-200 array status code: ${response.status}`);
        }

        const data = await response.json();

        // Optimized null-safe validation utility string parser
        const nullSafe = (value) => (value && String(value).trim() !== "") ? value : 'Not Specified';

        // Format and align standard time strings
        const creationEra = data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Era';
        const updateEra = data.updated_at ? new Date(data.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Era';

        // Build premium terminal dashboard text layout
        const userInfo = `💻 *[𝗚𝗜𝗧𝗛𝗨𝗕  𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥  𝗠𝗔𝗧𝗥𝗜𝗫]* 💻\n\n` +
                         `👤 *Name:* ${nullSafe(data.name)}\n` +
                         `🔖 *Handle:* @${data.login}\n` +
                         `📝 *Bio:* ${nullSafe(data.bio)}\n\n` +
                         `🏢 *Alliance:* ${nullSafe(data.company)}\n` +
                         `📍 *Sector:* ${nullSafe(data.location)}\n` +
                         `📧 *Comms:* ${nullSafe(data.email)}\n` +
                         `🌐 *Domain:* ${nullSafe(data.blog)}\n\n` +
                         `⚔️ *𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑  𝐌𝐄𝐓𝐑𝐈𝐂𝐒:* ⚔️\n` +
                         `📦 *Public Repos:* ${data.public_repos ?? 0}\n` +
                         `👥 *Followers:* ${data.followers ?? 0}\n` +
                         `🤝 *Following:* ${data.following ?? 0}\n\n` +
                         `⏰ *Initialized:* ${creationEra}\n` +
                         `🔄 *Last Synchronized:* ${updateEra}\n\n` +
                         `👑 *Grid Core:* MILITAN Tracker Node`;

        // Default avatar image fallback if target user has no profile photo
        const avatarUrl = data.avatar_url || "https://files.catbox.moe/p8b7p5.jpg";

        await sendMediaMessage(client, m, {
            image: { url: avatarUrl },
            caption: userInfo
        });

    } catch (error) {
        console.error('GitHub Module Fatal Error Exception:', error);
        await sendReply(client, m, `💀 *[PROFILER COLLAPSED]*\n\nThe profiling array failed to parse the source profile metadata network node:\n\`\`\`${error.message}\`\`\``);
    }
};