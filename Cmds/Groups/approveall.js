const groupMiddleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
  // Utilizing your clean middleware handler for group and admin checks
  await groupMiddleware(context, async () => {
    const { client, m, sendReply } = context;

    try {
      // Fetching the array of pending participant objects
      const responseList = await client.grahJ91ZuNL8Y2px8iYciYeHN8sfSh5eXH8(m.chat);

      if (!responseList || responseList.length === 0) {
        return sendReply(client, m, "🔮 *[GUILD RADAR]*\n\nThere are no pending gate requests at this moment. The perimeter is clear.");
      }

      await sendReply(client, m, `⚡ *[OPENING GUILD GATES]*\n\nProcessing approvals for ${responseList.length} incoming recruits...`);

      for (const participant of responseList) {
          const response = await client.grahJ91ZuNL8Y2px8iYciYeHN8sfSh5eXH8(
              m.chat, 
              [participant.jid], 
              "approve" 
          );
          console.log(response);
      }
      
      const successMsg = `⚔️ *[ACCESS GRANTED]* ⚔️\n\n` +
                         `All pending participants have been successfully admitted into the raid squad.\n\n` +
                         `🛡️ *Squad Commander:* MILITAN Core`;
                         
      sendReply(client, m, successMsg);

    } catch (error) {
      console.error('Error approving participants:', error);
      sendReply(client, m, "💀 *[GATEWAY ERROR]*\n\nThe authentication link failed while processing structural intake files.");
    }
  });
};