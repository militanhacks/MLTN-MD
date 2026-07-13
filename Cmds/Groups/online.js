const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, isOwner } = context;

        // Double check safeguard just in case middleware passes context fallbacks
        if (!isOwner) {
            return m.reply("🛡️ *[ACCESS DENIED]*\n\nThis high-tier sensory override command is restricted exclusively to the Monarch **MILITAN**.");
        }

        try {
            // Signal radar initialization
            await client.sendMessage(m.chat, { react: { text: '📡', key: m.key } });
            await m.reply("🔮 *[INITIALIZING RADAR SCAN]*\n\nProbing regional presence frequencies. Gathering mana signatures for the next 4 seconds... Please hold.");

            const groupMetadata = await client.groupMetadata(m.chat);
            const onlineMembers = new Set();

            // 1. Subscribe to everyone's presence tracking updates
            for (const participant of groupMetadata.participants) {
                // Ignore self to avoid redundancy
                if (participant.id === client.user.id) continue;
                await client.presenceSubscribe(participant.id).catch(() => {});
            }

            // 2. Define a temporary, isolated handler function
            const presenceHandler = (update) => {
                const { id, presences } = update;
                if (!presences) return;

                // Check if the update belongs to a member of this specific group chat
                if (groupMetadata.participants.some(p => p.id === id)) {
                    const userPresence = presences[id]?.lastKnownPresence;
                    if (userPresence === 'available' || userPresence === 'composing' || userPresence === 'recording') {
                        onlineMembers.add(id);
                    }
                }
            };

            // 3. Mount the temporary listener tracking matrix
            client.ev.on('presence.update', presenceHandler);

            // 4. Run the countdown collection window (4000 milliseconds)
            await new Promise((resolve) => setTimeout(resolve, 4000));

            // 5. CRITICAL: Unmount the listener immediately to prevent massive memory leaks
            client.ev.off('presence.update', presenceHandler);

            // 6. Format and process the final results array
            const activeList = Array.from(onlineMembers);

            if (activeList.length === 0) {
                return m.reply("🔮 *[SCAN COMPLETED]*\n\nNo active presence signatures detected in the immediate window. Members may have their read/presence privacy rules locked.");
            }

            let responseMsg = `👑 *[𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐒𝐄𝐍𝐒𝐎𝐑  𝐑𝐀𝐃𝐀𝐑]* 👑\n\n` +
                              `Successfully tracked *${activeList.length}* active entities online right now:\n\n`;

            activeList.forEach((jid, index) => {
                responseMsg += `${index + 1}. ⚡ @${jid.split('@')[0]}\n`;
            });

            responseMsg += `\n🛡️ *Scan Resolution:* 100% Core Integrity`;

            // Broadcast final results with proper active click-to-view user mentions
            await client.sendMessage(m.chat, { 
                text: responseMsg, 
                mentions: activeList 
            }, { quoted: m });

        } catch (error) {
            console.error("Error in listing online members:", error);
            m.reply("💀 *[RADAR MALFUNCTION]*\n\nThe scanning arrays encountered a network buffer overflow.");
        }
    });
};