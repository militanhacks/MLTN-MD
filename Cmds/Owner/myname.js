const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, text, isOwner } = context;

    try {
      if (!isOwner) {
        return m.reply("🛡️ *[ACCESS DENIED]*\n\nFalse Monarch detected. You do not possess the required authority to alter the system core.");
      }

      if (!text) {
        return m.reply("🔮 *[SYSTEM NOTICE]*\n\nPlease provide a new designation string to update the profile name.");
      }

      const name = text.trim();

      await client.updateProfileName(name);
      m.reply(`👑 *[SYSTEM DESIGNATION UPDATED]*\n\nThe profile name has been successfully overwritten.\n\n✨ *New Title:* ${name}\n⚔️ *Authority:* MILITAN`);
    } catch (error) {
      console.error("Error in updating profile name:", error);
      m.reply("💀 *[CRITICAL ERROR]*\n\nThe Hunter Association firewall or database stream rejected the designation change. Try again later.");
    }
  });
};