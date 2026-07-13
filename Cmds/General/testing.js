module.exports = async (context) => {
  const { client, m, prefix } = context; // Destructure 'm' and 'prefix' properly

  // Define the message content
  let p = `

  
 ⚡ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐎𝐍𝐋𝐈𝐍𝐄 — 𝐁𝐮𝐭𝐭𝐨𝐧 𝐓𝐞𝐬𝐭 ✅
  `;

  // Define the image URL
  let imagePath = 'https://files.catbox.moe/2gegza.jpg';

  // Define the buttons
  const buttons = [
    {
      buttonId: `${prefix}support`, 
      buttonText: { displayText: "Support" },
    },
    {
      buttonId: `${prefix}repo`, 
      buttonText: { displayText: "Repo" },
    },
    {
      buttonId: `${prefix}ping`, 
      buttonText: { displayText: "Speed" },
    },
  ];

 
  const flowActions = [
    {
      buttonId: "action",
      buttonText: { displayText: "Options" },
      type: 4,
      nativeFlowInfo: {
        name: "single_select",
        paramsJson: JSON.stringify({
          title: "MENU",
          sections: [
            {
              title: "Select The Menu",
              highlight_label: "",
              rows: [
                {
                  header: "MLTN",
                  title: "MD",
                  description: "Regards MLTN",
                  id: `${prefix}menu`, 
                },
                {
                  header: "MLTN MD",
                  title: "Appreciation",
                  description: "Regards to the owner",
                  id: `${prefix}speed`, 
                },
              ],
            },
          ],
        }),
      },
      viewOnce: true,
    },
  ];

 
  const buttonMessage = {
    image: { url: imagePath },
    caption: p,
    footer: "☠️ MLTN-MD — The shadows are watching\n",
    headerType: 1,
    buttons: buttons,
    viewOnce: true,
    contextInfo: {
      externalAdReply: {
        title: "MLTN Testing",
        body: "MLTN",
        thumbnailUrl: `https://files.catbox.moe/pi195r.webp`,
        sourceUrl: 'https://github.com/militanhacks',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };


  buttonMessage.buttons.push(...flowActions);

  
  await client.sendMessage(m.key.remoteJid, buttonMessage);
};