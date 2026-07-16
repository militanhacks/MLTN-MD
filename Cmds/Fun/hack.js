module.exports = async (context) => {
  try {
    const { m } = context;
    const mek = m;

    const steps = [
      "```[ SHADOW BREACH PROTOCOL INITIATED ]```",
      "```🌑 Scanning target defenses...```",
      "```█░░░░░░░░░░░░░░░░░░░ 5%  | Bypassing firewall```",
      "```███░░░░░░░░░░░░░░░░ 15% | Cracking encryption layer 1```",
      "```██████░░░░░░░░░░░░░ 30% | Cracking encryption layer 2```",
      "```█████████░░░░░░░░░░ 45% | Injecting shadow payload```",
      "```████████████░░░░░░░ 60% | Root access acquired```",
      "```███████████████░░░░ 75% | Extracting target data```",
      "```█████████████████░░ 88% | Deploying shadow soldiers```",
      "```████████████████████ 100% | Breach complete```",
      "```🩸 SYSTEM COMPROMISED\\nAll defenses have fallen silent.```",
      "```📡 Rerouting extracted data through encrypted shadow tunnel...```",
      "```🗝️ Master keys copied. Access logs wiped. No trace remains.```",
      "```⚔️ HACK COMPLETE — Target now belongs to the shadows.```",
      "```👑 Executed under the authority of the Shadow Monarch```",
      "```⛧ Powered by MLTN-MD ⛧```"
    ];

    for (const line of steps) {
      await context.client.sendMessage(m.chat, { text: line }, { quoted: mek });
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

  } catch (error) {
    console.error('Error during hack simulation:', error);
    context.client.sendMessage(m.chat, {
      text: `⛔ *[BREACH FAILED]*\n\n💢 The shadow tunnel collapsed mid-transfer.\nReason: ${error.message}`
    });
  }
};