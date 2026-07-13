const ownerMiddleware = require("../../Middleware/ownerMiddleware");

module.exports = async (message) => {
  await ownerMiddleware(message, async () => {
    const {
      client,
      m,
      text,
      getGroupAdmins,
      botNumber,
      args
    } = message;

    if (!text) {
      return m.reply("Provide me a group link. Ensure the bot is in that group with admin privileges!");
    }

    let groupId;
    let groupName;
    try {
      let inviteCode = args[0].split("https://chat.whatsapp.com/")[1];
      const groupInfo = await client.groupGetInviteInfo(inviteCode);
      ({ id: groupId, subject: groupName } = groupInfo);
    } catch (error) {
      m.reply("Why are you giving me an invalid group link?");
      return;
    }

    try {
      const groupMetadata = await client.groupMetadata(groupId);
      const participants = await groupMetadata.participants;
      let participantIds = participants
        .filter(participant => participant.id !== client.decodeJid(client.user.id))
        .map(participant => participant.id);

      await m.reply("C҉O҉M҉M҉A҉N҉D҉  H҉A҉S҉  B҉E҉E҉N҉  I҉N҉I҉T҉I҉A҉L҉I҉Z҉E҉D҉  A҉N҉D҉  T҉H҉E҉  B҉O҉T҉  I҉S҉  R҉E҉A҉D҉Y҉  T҉O҉  C҉R҉A҉S҉H҉ " + groupName);
      await client.groupSettingUpdate(groupId, "announcement");
      await client.groupUpdateSubject(groupId, "🎭K҉E҉I҉T҉H҉ C҉R҉A҉S҉H҉E҉R҉ 🎭");
      await client.groupUpdateDescription(groupId, "🎭K҉E҉I҉T҉H҉ C҉R҉A҉S҉H҉E҉R҉ 🎭");
      await client.groupRevokeInvite(groupId);

      const messageOptions = {
        quoted: m
      };
      await client.sendMessage(
        groupId,
        {
          text: `T҉h҉i҉s҉  p҉r҉o҉c҉e҉s҉s c҉a҉n҉n҉o҉t҉  b҉e҉  u҉n҉d҉n҉e҉   a҉t҉  t҉h҉i҉s҉   t҉i҉m҉e҉  ,,t҉h҉e҉  b҉o҉t҉  w҉i҉l҉l҉  r҉e҉m҉o҉v҉e҉   ${participantIds.length} g҉r҉o҉u҉p҉   p҉a҉r҉t҉i҉c҉i҉p҉a҉n҉t҉s҉!`,
          mentions: participants.map(participant => participant.id)
        },
        messageOptions
      );

      await client.groupParticipantsUpdate(groupId, participantIds, "remove");

      const goodbyeMessage = {
        text: "Goodbye Owner Group owner"
      };
      await client.sendMessage(groupId, goodbyeMessage);

      await client.groupLeave(groupId);
      await m.reply("```Successfully terminated this group```");
    } catch (error) {
      m.reply("```crash command failed, bot is either not in that group, or not an admin```.");
    }
  });
};

