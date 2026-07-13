const TEMPNUMBER_API_URL = 'https://keith-api.vercel.app/api/tempnumber';
const TEMPNUMBER_CODE_API_URL = 'https://keith-api.vercel.app/api/tempnumbercode';

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        // Send processing signal
        await client.sendMessage(m.chat, { react: { text: '📡', key: m.key } });

        // User is requesting a specific code verification check for a number
        if (text && !isNaN(text.trim())) {
            const targetNumber = text.trim();
            // Appending target number if your API endpoint supports query parameters
            const codeResponse = await fetch(`${TEMPNUMBER_CODE_API_URL}?number=${targetNumber}`);
            if (!codeResponse.ok) throw new Error('Failed to intercept code terminal.');
            
            const codeData = await codeResponse.json();

            let codeMsg = `📡 *[DECRYPTION SIGNAL INTERCEPT]* 📡\n\n` +
                          `🛰️ *Target Line:* +${targetNumber}\n`;

            if (codeData.status && codeData.code) {
                codeMsg += `🔓 *Intercepted Code:* \`\`\`${codeData.code}\`\`\`\n\n`;
            } else if (codeData.result) {
                // Handle fallback if the API returns the code inside a result field
                codeMsg += `🔓 *Intercepted Code:* \`\`\`${codeData.result}\`\`\`\n\n`;
            } else {
                codeMsg += `⚠️ *Status:* Listening... No incoming verification payload detected yet for this cell.\n\n`;
            }
            
            codeMsg += `👑 *System:* MILITAN Intelligence Matrix`;
            return await client.sendMessage(m.chat, { text: codeMsg }, { quoted: m });
        }

        // Default Mode: Fetch available virtual numbers list
        const tempNumberResponse = await fetch(TEMPNUMBER_API_URL);
        if (!tempNumberResponse.ok) throw new Error('Failed to fetch tempnumber data');
        
        const responseData = await tempNumberResponse.json();
        const tempNumbers = responseData.result || responseData;

        if (!Array.isArray(tempNumbers) || tempNumbers.length === 0) {
            return await client.sendMessage(m.chat, { text: "🔮 *[SYSTEM NOTICE]*\n\nNo active shadow identities available in the server allocation pools right now." }, { quoted: m });
        }

        let message = '🕵️‍♂️ ━━━━━━━━━━━━━━━━━━━━ 🕵️‍♂️\n' +
                      '⚡  *𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐒𝐇𝐀𝐃𝐎𝐖  𝐈𝐃𝐄𝐍𝐓𝐈𝐓𝐈𝐄𝐒*  ⚡\n' +
                      '🕵️‍♂️ ━━━━━━━━━━━━━━━━━━━━ 🕵️‍♂️\n\n' +
                      'Use these terminal nodes for secure verification loops. Pass the phone number to check for incoming codes.\n\n';

        for (const { country, number, link } of tempNumbers) {
            message += `🌍 *Country:* ${country || 'Global Node'}\n` +
                       `📱 *Number:* \`\`\`+${number.replace('+', '')}\`\`\`\n` +
                       `🔗 *SMS Terminal:* ${link}\n` +
                       `━━━━━━━━━━━━━━━━━━━━\n`;
        }
        
        message += `\n✨ *Usage:* Type command along with the number to fetch live OTP payloads (e.g., .tempnumber ${tempNumbers[0].number})`;

        await client.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (error) {
        console.error('Error fetching temp numbers:', error);
        await client.sendMessage(m.chat, { 
            text: '💀 *[INTERCEPT EXCEPTION]*\n\nThe encryption link failed while attempting to interface with the virtual telecomm stream.' 
        }, { quoted: m });
    }
};