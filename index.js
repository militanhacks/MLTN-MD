/*Why does my code work? I don’t know. Why does my code break? I also don’t know.*/

const fs = require('fs');
const zlib = require('zlib');
const { session } = require("./settings");

async function authenticationn() {
  try {
    const credsPath = "./session/creds.json";

    if (!fs.existsSync(credsPath)) {
      console.log("Connecting...");
      const [header, b64data] = session.split(';;;');
      if (header === "MLTN" && b64data) {
        let compressedData = Buffer.from(b64data.replace('...', ''), 'base64');
        let decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, "utf8");
      } else {
        throw new Error("Invalid session format");
      }
    } else if (session !== "zokk") {
      console.log("Updating existing session...");
      const [header, b64data] = session.split(';;;');
      if (header === "MLTN" && b64data) {
        let compressedData = Buffer.from(b64data.replace('...', ''), 'base64');
        let decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, "utf8");
      } else {
        throw new Error("Invalid session format");
      }
    }
  } catch (error) {
    console.log("Session is invalid: " + error.message);
    return;
  }
}

authenticationn();

//Why do we call it "open source" when it feels more like "open wounds"?🗿🗿
//Because sharing is caring... and crying is healing🗿🗿

const {
  default: MLTNConnect, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent,
  generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, useMultiFileAuthState,
  DisconnectReason, makeInMemoryStore, downloadContentFromMessage, jidDecode
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");
const FileType = require("file-type");
const { exec } = require("child_process");
const chalk = require("chalk");
const express = require("express");
const { DateTime } = require("luxon");
const util = require("util");
const speed = require("performance-now");
const { smsg } = require('./lib/smsg');
const { downloadSession, uploadSession } = require('./lib/mongoSession');
const fetchLogoUrl = require('./lib/ephoto');
const {
  smsgsmsg, formatp, tanggal, formatDate, getTime, sleep, clockString,
  fetchJson, getBuffer, jsonformat, antispam, generateProfilePicture, parseMention,
  getRandom, fetchBuffer,
} = require("./lib/botFunctions.js");

const { TelegraPh, UploadFileUgu } = require("./lib/toUrl");
const uploadtoimgur = require("./lib/Imgur");
const { sendReply, sendMediaMessage } = require("./lib/context");
const { downloadYouTube, downloadSoundCloud, downloadSpotify, searchYouTube, searchSoundCloud, searchSpotify } = require("./lib/dl");
const ytmp3 = require("./lib/ytmp3");
const path = require("path");
const { commands, totalCommands } = require("./commandHandler");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const daddy = "254713421283@s.whatsapp.net";

const {
  autoview, autostatusreply, autostatusmsg, permit, autoread, botname, chatbot, timezone, autobio, mode, anticallmsg, reactemoji, prefix, presence,
 mycode, author, antibad, autodownloadstatus, packname, url, voicechatbot2, gurl, herokuAppname, greet, greetmsg, herokuapikey, anticall, dev, antilink, gcpresence, antibot, antitag, antidelete, autolike, voicechatbot, antionce
} = require("./settings");

const groupEvents = require("./groupEvents.js");
const axios = require("axios");
const googleTTS = require('google-tts-api');

const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.status(200).send('MLTN-MD is running.');
});

app.listen(port, () => {
  console.log(`✅ Web server listening on port ${port}`);
});
// Anti-delete functionality
const baseDir = 'message_data';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

function loadChatData(remoteJid, messageId) {
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
  try {
    const data = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function saveChatData(remoteJid, messageId, chatData) {
  const chatDir = path.join(baseDir, remoteJid);
  if (!fs.existsSync(chatDir)) {
    fs.mkdirSync(chatDir, { recursive: true });
  }
  const chatFilePath = path.join(chatDir, `${messageId}.json`);
  try {
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

function handleIncomingMessage(message) {
  const remoteJid = message.key.remoteJid;
  const messageId = message.key.id;
  const chatData = loadChatData(remoteJid, messageId);
  chatData.push(message);
  saveChatData(remoteJid, messageId, chatData);
}

async function handleMessageRevocation(client, revocationMessage) {
  const remoteJid = revocationMessage.key.remoteJid;
  const messageId = revocationMessage.message?.protocolMessage?.key?.id;
  const chatData = loadChatData(remoteJid, messageId);
  const originalMessage = chatData[0];
// 1. If the message is just an edit and NOT a deletion, stop immediately
    const pType = revocationMessage.message?.protocolMessage?.type;
    if (pType !== 0 && pType !== "REVOKE" && pType !== undefined) return;
  if (originalMessage) {
    const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
    const sentBy = originalMessage.key.participant || originalMessage.key.remoteJid;

    if (deletedBy.includes(client.user.id.split('@')[0]) || sentBy.includes(client.user.id.split('@')[0])) return;

    const delfrom = client.user.id.split(':')[0] + '@s.whatsapp.net';

    // ✦ FETCH REAL NAMES INSTEAD OF STRIPPING NUMBERS
    let deletedByName = "Unknown Hunter";
    let sentByName = "Unknown Target";
    
    try {
      const cleanDeletedJid = deletedBy.split(':')[0] + '@s.whatsapp.net';
      deletedByName = await client.getName(cleanDeletedJid);
    } catch {
      deletedByName = `@${deletedBy.split('@')[0]}`;
    }

    try {
      const cleanSentJid = sentBy.split(':')[0] + '@s.whatsapp.net';
      sentByName = await client.getName(cleanSentJid);
    } catch {
      sentByName = `@${sentBy.split('@')[0]}`;
    }

    let notificationText = `☠️ 𝐌𝐋𝐓𝐍 𝐌𝐃 𝐀𝐍𝐓𝐈-𝐃𝐄𝐋𝐄𝐓𝐄 ☠️\n\n` +
                           `👑 *Action By:* ${deletedByName}\n` +
                           `🎯 *Original Author:* ${sentByName}\n\n` +
                           `🩸 *Another target tried to erase their tracks...*\n`;

    if (originalMessage.message?.conversation) {
      const messageText = originalMessage.message.conversation;
      notificationText += `*Message Text:* \`\`\`${messageText}\`\`\``;
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.imageMessage) {
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { image: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.videoMessage) {
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { video: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.stickerMessage) {
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { sticker: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.documentMessage) {
      const fileName = originalMessage.message.documentMessage.fileName || 'file';
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { document: buffer, fileName: fileName });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.audioMessage) {
      const buffer = await client.downloadMediaMessage(originalMessage);
      const isPTT = originalMessage.message.audioMessage.ptt === true;
      await client.sendMessage(delfrom, { audio: buffer, ptt: isPTT, mimetype: 'audio/mpeg', fileName: `${messageId}.mp3` });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.extendedTextMessage) {
      const messageText = originalMessage.message.extendedTextMessage.text;
      notificationText += `   *Message Text:* \`\`\`${messageText}\`\`\``;
      await client.sendMessage(delfrom, { text: notificationText });
    }
  }
}

let repliedContacts = new Set();
async function startMLTN() {
  await downloadSession();
  const { saveCreds, state } = await useMultiFileAuthState("session");
  const client = MLTNConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: ["MLTN-MD", "Safari", "3.0"],
    fireInitQueries: false,
    shouldSyncHistoryMessage: true,
    downloadHistory: true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    auth: state,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg.message || undefined;
      }
      return { conversation: "HERE" };
    },
  });

  store.bind(client.ev);

  if (autobio === "true") {
    setInterval(() => {
      const date = new Date();
      client.updateProfileStatus(
        `${botname} is active 24/7\n\n${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })} It's a ${date.toLocaleString("en-US", { weekday: "long", timeZone: "Africa/Nairobi" })}.`
      );
    }, 10 * 1000);
  }

  let lastTextTime = 0;
  const messageDelay = 5000;

  client.ev.on('call', async (callData) => {
    if (anticall === 'true') {
      const callId = callData[0].id;
      const callerId = callData[0].from;
      await client.rejectCall(callId, callerId);
      const currentTime = Date.now();
      if (currentTime - lastTextTime >= messageDelay) {
        await client.sendMessage(callerId, { text: anticallmsg });
        lastTextTime = currentTime;
      } else {
        console.log('Message skipped to prevent overflow');
      }
    }
  });

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0];
      if (!mek.message) return;

// 🕵️‍♂️ DETECT AND LOG DELETED MESSAGES
            if (mek.message?.protocolMessage && mek.message.protocolMessage.type === 0) {
                const key = mek.message.protocolMessage.key;
                
                const deleterNumber = mek.key.participant ? mek.key.participant.split('@')[0] : (mek.key.remoteJid.endsWith('@g.us') ? 'Someone' : mek.key.remoteJid.split('@')[0]);
                const originalSender = key.participant || key.remoteJid || mek.key.remoteJid;
                const originalSenderNumber = originalSender.split('@')[0];

            const ownerJid = client.decodeJid(client.user.id);
              const deleteNotice = `𓆩⚔️𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐎𝐍𝐀𝐑𝐂𝐇'𝐒 𝐖𝐀𝐓𝐂𝐇* 𓆩⚔️𓆪\n\n☠️ 𝘈 𝘴𝘰𝘶𝘭 𝘵𝘳𝘪𝘦𝘥 𝘵𝘰 𝘷𝘢𝘯𝘪𝘴𝘩 𝘸𝘪𝘵𝘩𝘰𝘶𝘵 𝘢 𝘵𝘳𝘢𝘤𝘦...\n𝘉𝘶𝘵 𝘯𝘰𝘵𝘩𝘪𝘯𝘨 𝘦𝘴𝘤𝘢𝘱𝘦𝘴 𝘵𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴. 🖤\n\n━━━━━━━━━━━━━━━━\n🩸 *𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐁𝐲*    : @${deleterNumber}\n👁️ *𝐎𝐫𝐢𝐠𝐢𝐧𝐚𝐥 𝐀𝐮𝐭𝐡𝐨𝐫* : @${originalSenderNumber}\n📍 *𝐂𝐡𝐚𝐭*         : ${mek.key.remoteJid}\n👑 *𝐒𝐲𝐬𝐭𝐞𝐦 𝐎𝐰𝐧𝐞𝐫*  : 𝐌𝐈𝐋𝐈𝐓𝐀𝐍\n━━━━━━━━━━━━━━━━\n\n⚡ *"Run all you want... I see everything."*\n— Shadow Monarch`;

               await client.sendMessage(ownerJid, { 
                    text: deleteNotice, 
                    contextInfo: { mentionedJid: [mek.key.participant, originalSender].filter(Boolean) } 
                });
                return;
            }

            // Normal message logging
            if (mek.message?.conversation || mek.message?.extendedTextMessage?.text) {
                console.log("📩 TEXT MSG:", mek.key.remoteJid, "| fromMe:", mek.key.fromMe, "| text:", mek.message.conversation || mek.message.extendedTextMessage.text);
            }
      
      mek.message = mek.message.ephemeralMessage?.message || mek.message;
      const idBot = client.decodeJid(client.user.id);
      
      if (mek.key && mek.key.remoteJid === 'status@broadcast' && autodownloadstatus === "true") {
        if (mek.message.extendedTextMessage) {
          const stTxt = mek.message.extendedTextMessage.text;
          await client.sendMessage(idBot, { text: stTxt }, { quoted: mek });
        } else if (mek.message.imageMessage) {
          const stMsg = mek.message.imageMessage.caption;
          const stream = await downloadContentFromMessage(mek.message.imageMessage, 'image');
          let buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          await client.sendMessage(idBot, { image: buffer, caption: stMsg }, { quoted: mek });
        } else if (mek.message.videoMessage) {
          const stMsg = mek.message.videoMessage.caption;
          const stream = await downloadContentFromMessage(mek.message.videoMessage, 'video');
          let buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          await client.sendMessage(idBot, { video: buffer, caption: stMsg }, { quoted: mek });
        }
      }
      
      if (autoview === 'true' && autolike === 'true' && mek.key && mek.key.remoteJid === "status@broadcast") {
        const MLTNlike = await client.decodeJid(client.user.id);
        const emojis = ['😂', '😥', '😇', '🥹', '💥', '💯', '🔥', '💫', '👽', '💗', '❤️‍🔥', '👁️', '👀', '🙌', '🙆', '🌟', '💧', '🎇', '🎆', '♂️', '✅'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const delayMessage = 3000;
        await client.sendMessage(mek.key.remoteJid, {
          react: { text: randomEmoji, key: mek.key }
        }, { statusJidList: [mek.key.participant, MLTNlike] });
        await sleep(delayMessage);
      }

      if (autoview === "true" && mek.key?.remoteJid === "status@broadcast") {
        await client.readMessages([mek.key]);
      } else if (autoread === "true" && mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
        await client.readMessages([mek.key]);
      }

      if (mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
        const presenceType = presence === "online" ? "available" : presence === "typing" ? "composing" : presence === "recording" ? "recording" : "unavailable";
        await client.sendPresenceUpdate(presenceType, mek.key.remoteJid);
      }

      if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;

      const m = smsg(client, mek, store);
      const body = m.mtype === "conversation" ? m.message.conversation :
                   m.mtype === "imageMessage" ? m.message.imageMessage.caption :
                   m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";

      const cmd = body.startsWith(prefix);
      const args = body.trim().split(/ +/).slice(1);
      const pushname = m.pushName || "No Name";
      const botNumber = await client.decodeJid(client.user.id);
      const servBot = botNumber.split('@')[0];
      const Ghost = "254789961589"; 
      const Ghost2 = "254748373318";
      const Ghost3 = "254768707399";
      const superUserNumbers = [servBot, Ghost, Ghost2, Ghost3, dev].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net");
      const isOwner = superUserNumbers.includes(m.sender); 
      const itsMe = m.sender === botNumber;
      const text = args.join(" ");
      const Tag = m.mtype === "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : [];

      let msgMLTN = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
      const mime = m.quoted?.mimetype || "";
      const qmsg = m.quoted || m;
      
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => {}) : "";
      const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
      const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
      
      const getGroupAdmins = (participantsList) => {
        let admins = [];
        for (let i of participantsList) {
          if (i.admin === "superadmin" || i.admin === "admin") admins.push(i.id);
        }
        return admins || [];
      };
      
      const groupAdmin = m.isGroup ? getGroupAdmins(participants) : [];
      const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false;
      const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;
      const IsGroup = m.chat?.endsWith("@g.us");

      // Anti-delete functionality
      if (antidelete === "true") {
        if (mek.message?.protocolMessage?.key) {
          await handleMessageRevocation(client, mek);
        } else {
          handleIncomingMessage(mek);
        }
      }

      const messageText = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
      const remoteJid = mek.key.remoteJid;
      const senderJid = mek.key.participant || mek.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];
      let auto_reply_message = `@${senderNumber}\n${greetmsg}`;

      if (messageText.match(/^[^\w\s]/) && mek.key.fromMe) {
        const localPrefix = messageText[0]; 
        const command = messageText.slice(1).split(" ")[0]; 
        const newMessage = messageText.slice(localPrefix.length + command.length).trim(); 

        if (command === "setautoreply" && newMessage) {
          greetmsg = newMessage;
          await client.sendMessage(remoteJid, { text: `Auto-reply message has been updated to:\n"${newMessage}"` });
          return;
        }
      }

      if (greet === "true" && !repliedContacts.has(remoteJid) && !mek.key.fromMe && !remoteJid.includes("@g.us")) {
        await client.sendMessage(remoteJid, { text: auto_reply_message, mentions: [senderJid] });
        repliedContacts.add(remoteJid);
      }
      
      const forbiddenLinkPattern = /https?:\/\/[^\s]+/;
      if (body && forbiddenLinkPattern.test(body) && m.isGroup && antilink === 'true' && !isOwner && isBotAdmin && !isAdmin) {
        if (itsMe) return;
        const kid = m.sender;
        await client.sendMessage(m.chat, { text: `🚫Antilink detected🚫\n\n@${kid.split("@")[0]}, do not send links!`, contextInfo: { mentionedJid: [kid] } }, { quoted: m });
        await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: kid } });

        if (!isBotAdmin) {
          await client.sendMessage(m.chat, { text: `Please promote me to an admin to remove @${kid.split("@")[0]} for sharing link.` });
        } else {
          await client.groupParticipantsUpdate(m.chat, [kid], 'remove');
        }
      }

      const forbiddenWords = ['kuma', 'mafi', 'kumbavu', 'ngombe', 'fala', 'asshole', 'cunt', 'cock', 'slut', 'fag'];
      if (body && forbiddenWords.some(word => body.toLowerCase().includes(word))) {
        if (m.isGroup && antibad === 'true') {
          if (isBotAdmin && !isOwner && !isAdmin) {
            const kid = m.sender;
            await client.sendMessage(m.chat, { text: `🚫bad word detected 🚫\n\n@${kid.split("@")[0]}, do not send offensive words!`, contextInfo: { mentionedJid: [kid] } }, { quoted: m });
            await client.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: kid } });
            await client.groupParticipantsUpdate(m.chat, [kid], 'remove');
            await client.updateBlockStatus(kid, 'block');
          }
        } else if (!m.isGroup && antibad === 'true') {
          const kid = m.sender;
          await client.updateBlockStatus(kid, 'block');
        }
      }

      if (antibot === "true" && mek.key.id.startsWith("BAE5") && m.isGroup && !isOwner && isBotAdmin && mek.key.id.length === 16) {
        try {
          const botJid = m.sender;
          const targetBotNum = botJid.split('@')[0];
          await client.sendMessage(m.chat, { text: `🚫 Antibot detected 🚫\n\n@${targetBotNum} has been removed `, contextInfo: { mentionedJid: [botJid] } }, { quoted: m });
          await client.groupParticipantsUpdate(m.chat, [botJid], "remove");
        } catch (error) {
          console.error('Error in antibot functionality:', error);
        }
      } 

      if (cmd && mode === "private" && !itsMe && m.sender !== daddy) return;
      
      try {
        const Blocked = await client.fetchBlocklist().catch(() => []);
        if (cmd && m.isGroup && Blocked?.includes(m.sender)) {
            await m.reply("You are blocked from using bot commands.");
            return;
        }
        if (m.chat.endsWith('@s.whatsapp.net') && cmd && permit === 'true' && !isOwner) {
            await m.reply("You have no access to commands here. ❌");
            return;
        }
      } catch (error) {
          console.error("An error occurred while processing block permissions:", error);
      }

      // ✦ CRITICAL FIXED ZONE: Secure execution loop with error tracking
      const command = cmd ? body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase() : null;
      if (command) {
        const commandObj = commands[command];
        if (commandObj) {
          try {
            await commandObj.execute({ downloadYouTube, downloadSoundCloud, downloadSpotify, searchYouTube, searchSoundCloud, searchSpotify, fetchLogoUrl, isOwner, anticall, fetchJson, exec, getRandom, generateProfilePicture, args, dev, client, m, mode, mime, qmsg, msgMLTN, Tag, text, totalCommands, botname, url, sendReply, sendMediaMessage, gurl, prefix, groupAdmin, getGroupAdmins, groupName, groupMetadata, herokuAppname, herokuapikey, packname, author, participants, pushname, botNumber, itsMe, store, isAdmin, isBotAdmin });
          } catch (cmdError) {
            console.error(chalk.red(`\n❌ CRASH DETECTED IN COMMAND [.${command}]:\n`), cmdError);
            await m.reply(`⚠️ Command .${command} failed to load. Check your panel logs.`);
          }
        } else {
          console.log(chalk.yellow(`❓ Triggers detected, but .${command} is not loaded in commands handler.`));
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("uncaughtException", (err) => {
    console.error("Caught exception:", err);
  });

  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    }
    return jid;
  };

  client.public = true;
  client.serializeM = (m) => smsg(client, m, store);
  client.ev.on("group-participants.update", (m) => groupEvents(client, m));

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      const reasons = {
        [DisconnectReason.badSession]: "Bad Session File, Please Delete Session and Scan Again",
        [DisconnectReason.connectionClosed]: "Connection closed, reconnecting...",
        [DisconnectReason.connectionLost]: "Connection Lost from Server, reconnecting...",
        [DisconnectReason.connectionReplaced]: "Connection Replaced, Another New Session Opened, Please Restart Bot",
        [DisconnectReason.loggedOut]: "Device Logged Out, Please Delete File creds.json and Scan Again",
        [DisconnectReason.restartRequired]: "Restart Required, Restarting...",
        [DisconnectReason.timedOut]: "Connection TimedOut, Reconnecting...",
      };
      console.log(reasons[reason] || `Unknown DisconnectReason: ${reason}`);
      if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.loggedOut) {
        process.exit();
      } else {
        startMLTN();
      }
    } else if (connection === "open") {
      console.log(`✅ Connected to MLTN server.`);
      console.log(`✅ bot is active ✅`);
      console.log(`✅ Loaded ${totalCommands} commands.`);

      const getGreeting = () => {
        const currentHour = DateTime.now().setZone("Africa/Nairobi").hour;
        if (currentHour >= 5 && currentHour < 12) return "𝐀𝐧𝐨𝐭𝐡𝐞𝐫 𝐦𝐨𝐫𝐧𝐢𝐧𝐠 𝐭𝐨 𝐡𝐮𝐧𝐭... 𝐓𝐡𝐞𝐢𝐫 𝐟𝐞𝐚𝐫 𝐬𝐦𝐞𝐥𝐥𝐬 𝐝𝐞𝐥𝐢𝐜𝐢𝐨𝐮𝐬 🩸";
        if (currentHour >= 12 && currentHour < 18) return "𝐓𝐡𝐞 𝐬𝐮𝐧 𝐢𝐬 𝐡𝐢𝐠𝐡, 𝐛𝐮𝐭 𝐦𝐲 𝐛𝐥𝐚𝐝𝐞 𝐬𝐭𝐚𝐲𝐬 𝐢𝐧 𝐭𝐡𝐞 𝐬𝐡𝐚𝐝𝐨𝐰𝐬... 🗡️";
        if (currentHour >= 18 && currentHour < 22) return "𝐓𝐰𝐢𝐥𝐢𝐠𝐡𝐭 𝐛𝐫𝐢𝐧𝐠𝐬 𝐭𝐡𝐞 𝐩𝐞𝐫𝐟𝐞𝐜𝐭 𝐜𝐨𝐯𝐞 r. 𝐓𝐢𝐦𝐞 𝐭𝐨 𝐜𝐥𝐞𝐚𝐧 𝐭𝐡𝐞 𝐬𝐭𝐫𝐞𝐞𝐭𝐬 🩸";
        return "𝐓𝐡𝐞 𝐛𝐥𝐨𝐨δ 𝐦𝐨𝐨𝐧 𝐫𝐢𝐬𝐞𝐬. 𝐍𝐨 𝐨𝐧𝐞 𝐬𝐮𝐫𝐯𝐢𝐯𝐞𝐬 𝐭𝐡𝐢𝐬 𝐬𝐡𝐢𝐟𝐭... 💀";
      };

      const message = `✦━━━━━━━━━━━━━━✦\n⛯ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐖𝐀𝐊𝐄𝐍𝐈𝐍𝐆 ⛯\n✦━━━━━━━━━━━━━━✦\n\n${getGreeting()}\n💀 ${botname} 𝐡𝐚𝐬 𝐚𝐫𝐢𝐬𝐞𝐧 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐡𝐚𝐝𝐨𝐰𝐬 🌑\n🔮 𝐒𝐮𝐦𝐦𝐨𝐧𝐞𝐝 𝐛𝐲 𝐭𝐡𝐞 𝐒𝐡𝐚𝐝𝐨𝐰 𝐌𝐨𝐧𝐚𝐫𝐜𝐡 — ${author} 👑\n\n┏━━━━━━━━━━━━━━━┓\n ⚡ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐖𝐈𝐍𝐃𝐎𝐖 ⚡\n┗━━━━━━━━━━━━━━━┛\n\n╭─❍͙۪۫ ⋆ ❍͙۪۫─╮\n👑 𝐌𝐎𝐍𝐀𝐑𝐂𝐇   : ${author}\n🌑 𝐑𝐀𝐍𝐊      : ${mode}\n🗡️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃   : [ ${prefix} ]\n⚔️ 𝐀𝐑𝐒𝐄𝐍𝐀𝐋   : ${totalCommands}\n⏰ 𝐓𝐈𝐌𝐄 𝐆𝐀𝐓𝐄 : ${DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE)}\n📜 𝐋𝐈𝐁𝐑𝐀𝐑𝐘   : Baileys\n╰─❍͙۪۫ ⋆ ❍͙۪۫─╯\n\n⚡ 𝐀 𝐑 𝐈 𝐒 𝐄 . 𝐓 𝐇 𝐄  𝐇 𝐔 𝐍 𝐓  𝐁 𝐄 𝐆 𝐈 𝐍 𝐒 ⚡`;
      await client.sendMessage(client.user.id, { text: message });
      console.log(`\nConnected successfully!\n`);
    }
  });

  client.ev.on("creds.update", async () => {
  await saveCreds();
  await uploadSession();
});
  client.sendText = (jid, text, quoted = "", options) => client.sendMessage(jid, { text, ...options }, { quoted });
}

startMLTN();
