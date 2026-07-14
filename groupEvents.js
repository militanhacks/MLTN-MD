const events = process.env.EVENTS || 'false';
const botname = process.env.BOTNAME || 'MLTN-MD';

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender]
    };
};

// Cache groupMetadata per group for 5 minutes to avoid rate-overlimit errors
// when several join/leave/promote/demote events fire in quick succession.
const metadataCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getCachedGroupMetadata(client, groupId) {
    const cached = metadataCache.get(groupId);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
        return cached.data;
    }
    const data = await client.groupMetadata(groupId);
    metadataCache.set(groupId, { data, time: Date.now() });
    return data;
}

const Events = async (client, MILITAN) => {
    const Myself = await client.decodeJid(client.user.id);

    try {
        let metadata = await getCachedGroupMetadata(client, MILITAN.id);
        let participants = MILITAN.participants;
        let desc = metadata.desc || "No Description";
        let groupMembersCount = metadata.participants.length;

        for (let num of participants) {
            let dpuser;
            let userName = num.split("@")[0];

            try {
                dpuser = await client.profilePictureUrl(num, "image");
            } catch (e) {
                dpuser = "https://i.imgur.com/iEWHnOH.jpeg";
            }

            const timeJoined = new Date().toLocaleString();
            const timeLeft = new Date().toLocaleString();

            if (MILITAN.action === "add") {
                const WelcomeText = "Hey @" + userName + " Welcome to " + metadata.subject + ". You are member number " + groupMembersCount + " in this group. Time joined: " + timeJoined + ". Please read the group description: " + desc + " Powered by " + botname + ".";

                if (events === 'true') {
                    await client.sendMessage(MILITAN.id, {
                        image: { url: dpuser },
                        caption: WelcomeText,
                        mentions: [num],
                        contextInfo: getContextInfo({ sender: Myself }),
                    });
                }
            } else if (MILITAN.action === "remove") {
                const GoodbyeText = "Goodbye @" + userName + ". Another member has left the group. Time left: " + timeLeft + ". The group now has " + groupMembersCount + " members.";

                if (events === 'true') {
                    await client.sendMessage(MILITAN.id, {
                        image: { url: dpuser },
                        caption: GoodbyeText,
                        mentions: [num],
                        contextInfo: getContextInfo({ sender: Myself }),
                    });
                }
            } else if (MILITAN.action === "demote" && events === 'true') {
                await client.sendMessage(MILITAN.id, {
                    text: "@" + MILITAN.author.split("@")[0] + " has demoted @" + MILITAN.participants[0].split("@")[0] + " from admin.",
                    mentions: [MILITAN.author, MILITAN.participants[0]],
                    contextInfo: getContextInfo({ sender: Myself }),
                });
            } else if (MILITAN.action === "promote" && events === 'true') {
                await client.sendMessage(MILITAN.id, {
                    text: "@" + MILITAN.author.split("@")[0] + " has promoted @" + MILITAN.participants[0].split("@")[0] + " to admin.",
                    mentions: [MILITAN.author, MILITAN.participants[0]],
                    contextInfo: getContextInfo({ sender: Myself }),
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = Events;