const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = async (context) => {
  const { client, m, packname, author, msgMLTN } = context;

  if (!msgMLTN) {
    m.reply('🔮 *[SYSTEM NOTICE]*\n\nTo forge a new shadow soldier, you must quote an image or a short video. Try again.');
    return;
  }

  // 1. Verify if the target payload has valid media keys
  const directImage = msgMLTN.imageMessage;
  const directVideo = msgMLTN.videoMessage;
  
  const quotedMsg = msgMLTN.extendedTextMessage?.contextInfo?.quotedMessage;
  const quotedImage = quotedMsg?.imageMessage;
  const quotedVideo = quotedMsg?.videoMessage;

  if (!directImage && !directVideo && !quotedImage && !quotedVideo) {
    m.reply('❌ *[SYSTEM ERROR]*\n\nThat item cannot be extracted into a shadow! Provide a valid image or short video.');
    return;
  }

  // Notify the user with a stylized extraction message
  m.reply('✨ *Extraction capability activated...*\n\n"𝐀 𝐑 𝐈 𝐒 𝐄 ." 🌑\nProcessing your shadow sticker...');

  try {
    // 🌟 THE CRASH FIX: Re-route the downloader target if it's a quoted reply
    let downloadTarget = msgMLTN;
    if (quotedImage || quotedVideo) {
      downloadTarget = { message: quotedMsg };
    }

    // 2. Pass the correctly targeted message structure into the downloader
    const result = await client.downloadAndSaveMediaMessage(downloadTarget);

    let stickerResult = new Sticker(result, {
      pack: packname || 'MLTN MD Pack',
      author: author || 'Monarch System',
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 70,
      background: "transparent",
    });

    const Buffer = await stickerResult.toBuffer();
    await client.sendMessage(m.chat, { sticker: Buffer }, { quoted: m });
    
  } catch (error) {
    console.error(error);
    m.reply('💀 *[SYSTEM NOTICE]*\n\nThe extraction failed. The target\'s mana was too low or the file is corrupted.');
  }
};