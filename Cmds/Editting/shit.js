const canvacord = require("canvacord");

module.exports = async (context) => {
    const { client, m, Tag, botname } = context;

    let cap = `✨ *[PROTO-GEN COMPLETE]*\n\nImage successfully re-rendered by ${botname}.`;
    let imgUrl;
    let result;

    try {
        // Step 1: Resolve target user's profile picture
        if (m.quoted) {
            try {
                imgUrl = await client.profilePictureUrl(m.quoted.sender, 'image');
            } catch {
                imgUrl = "https://files.catbox.moe/p8b7p5.jpg"; // Reliable permanent fallback asset
            }
        } else if (Tag && Tag.length > 0) {
            try {
                imgUrl = await client.profilePictureUrl(Tag[0], 'image');
            } catch {
                imgUrl = "https://files.catbox.moe/p8b7p5.jpg";
            }
        } else {
            // Self-target fallback if no quote or tag is present
            try {
                imgUrl = await client.profilePictureUrl(m.sender, 'image');
            } catch {
                imgUrl = "https://files.catbox.moe/p8b7p5.jpg";
            }
        }

        // Step 2: Inform operator processing has initialized
        await client.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });

        // Step 3: Run the image buffer generation block through canvacord
        result = await canvacord.Canvacord.shit(imgUrl);

        if (!result) {
            throw new Error("Canvacord compilation returned null buffer.");
        }

        // Step 4: Broadcast the finalized image layout payload
        await client.sendMessage(m.chat, { 
            image: result, 
            caption: cap 
        }, { quoted: m });

    } catch (e) {
        console.error("Error in canvacord filter command:", e);
        m.reply("💀 *[TRANSMUTATION FAILURE]*\n\nThe image canvas stream corrupted during asset conversion.");
    }
};