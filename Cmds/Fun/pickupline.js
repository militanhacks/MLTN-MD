const API_URL = 'https://api.popcat.xyz/pickuplines';

module.exports = async (context) => {
    const { client, m } = context;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');

        const { pickupline } = await response.json();
        const lineMessage = `
𓆩💋𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐖𝐇𝐈𝐒𝐏𝐄𝐑* 𓆩💋𓆪

━━━━━━━━━━━━━━━━
${pickupline}
━━━━━━━━━━━━━━━━

⚡ 𝘌𝘷𝘦𝘯 𝘢 𝘔𝘰𝘯𝘢𝘳𝘤𝘩 𝘬𝘯𝘰𝘸𝘴 𝘩𝘰𝘸 𝘵𝘰 𝘤𝘩𝘢𝘳𝘮 𝘣𝘦𝘧𝘰𝘳𝘦 𝘩𝘦 𝘤𝘰𝘯𝘲𝘶𝘦𝘳𝘴.

⛧ 𝑾𝒉𝒊𝒔𝒑𝒆𝒓𝒆𝒅 𝒃𝒚 𝑴𝑳𝑻𝑵-𝑴𝑫 ⛧
        `;

        await client.sendMessage(m.chat, { text: lineMessage }, { quoted: m });
    } catch (error) {
        console.error('Error fetching data:', error);
        await client.sendMessage(m.chat, { text: '⛔ Even shadows have nothing smooth to say right now. Try again shortly.' }, { quoted: m });
    }
};