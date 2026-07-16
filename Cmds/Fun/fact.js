const API_URL = 'https://nekos.life/api/v2/fact';

module.exports = async (context) => {
    const { client, m } = context;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');

        const { fact } = await response.json();
        const factMessage = `
𓆩📜𓆪 *𝐅𝐎𝐑𝐁𝐈𝐃𝐃𝐄𝐍 𝐊𝐍𝐎𝐖𝐋𝐄𝐃𝐆𝐄* 𓆩📜𓆪

━━━━━━━━━━━━━━━━
${fact}
━━━━━━━━━━━━━━━━

👁️ 𝘌𝘷𝘦𝘳𝘺 𝘴𝘦𝘤𝘳𝘦𝘵 𝘦𝘷𝘦𝘯𝘵𝘶𝘢𝘭𝘭𝘺 𝘴𝘶𝘳𝘧𝘢𝘤𝘦𝘴 𝘧𝘳𝘰𝘮 𝘵𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴.

⛧ 𝑹𝒆𝒗𝒆𝒂𝒍𝒆𝒅 𝒃𝒚 𝑴𝑳𝑻𝑵-𝑴𝑫 ⛧
        `;

        await client.sendMessage(m.chat, { text: factMessage }, { quoted: m });
    } catch (error) {
        console.error('Error fetching data:', error);
        await client.sendMessage(m.chat, { text: '⛔ The archive stayed silent. Try again shortly.' }, { quoted: m });
    }
};