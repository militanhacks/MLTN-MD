module.exports = async (context) => {
    const { client, m, budy, Owner } = context;

    if (!Owner) {
        return m.reply("🛡️ *[ACCESS DENIED]*\n\nYour power level is insufficient. Only the True Monarch **MILITAN** can force a system sequence reboot!");
    }

    try {
        // High-energy system shutdown message
        await m.reply("⚡ *[SYSTEM OVERLOAD INITIALIZED]*\n\n\"𝐒𝐡𝐮𝐭𝐭𝐢𝐧𝐠 𝐝𝐨𝐰𝐧 𝐭𝐡𝐞 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐝𝐮𝐧𝐠𝐞𝐚𝐧 𝐢𝐧𝐬𝐭𝐚𝐧𝐜𝐞...\"\nForce quitting engine links. Re-awakening in 3 seconds... ⏳");

        // Add a delay function
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await sleep(3000);  // Sleep for 3 seconds before restarting

        process.exit();  // Exit the process to restart the bot
    } catch (error) {
        console.error("Error during restart:", error);
        m.reply("💀 *[REBOOT FAILED]*\n\nThe system core resisted the restart sequence. Check terminal log streams.");
    }
};