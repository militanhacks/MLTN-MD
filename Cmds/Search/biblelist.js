module.exports = async (context) => {
  const { client, m, sendReply, author, botname, sendMediaMessage } = context;

  const messageCaption = `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n` +
                         `📚  *𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐌𝐃  𝐁𝐈𝐁𝐋𝐄  𝐈𝐍𝐃𝐄𝐗*  📚\n` +
                         `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n\n` +
                         `🕊️ *𝐎𝐋𝐃  𝐓𝐄𝐒𝐓𝐀𝐌𝐄𝐍𝐓:* \n` +
                         `1. Genesis       2. Exodus        3. Leviticus\n` +
                         `4. Numbers       5. Deuteronomy   6. Joshua\n` +
                         `7. Judges        8. Ruth          9. 1 Samuel\n` +
                         `10. 2 Samuel     11. 1 Kings      12. 2 Kings\n` +
                         `13. 1 Chronicles 14. 2 Chronicles 15. Ezra\n` +
                         `16. Nehemiah     17. Esther       18. Job\n` +
                         `19. Psalms       20. Proverbs     21. Ecclesiastes\n` +
                         `22. Song of Sol  23. Isaiah       24. Jeremiah\n` +
                         `25. Lamentations 26. Ezekiel      27. Daniel\n` +
                         `28. Hosea        29. Joel         30. Amos\n` +
                         `31. Obadiah      32. Jonah        33. Micah\n` +
                         `34. Nahum        35. Habakkuk     36. Zephaniah\n` +
                         `37. Haggai       38. Zechariah    39. Malachi\n\n` +
                         `👑 *𝐍𝐄𝐖  𝐓𝐄𝐒𝐓𝐀𝐌𝐄𝐍𝐓:* \n` +
                         `1. Matthew       2. Mark          3. Luke\n` +
                         `4. John          5. Acts          6. Romans\n` +
                         `7. 1 Cor         8. 2 Cor         9. Galatians\n` +
                         `10. Ephesians    11. Philippians  12. Colossians\n` +
                         `13. 1 Thess      14. 2 Thess      15. 1 Timothy\n` +
                         `16. 2 Timothy    17. Titus        18. Philemon\n` +
                         `19. Hebrews      20. James        21. 1 Peter\n` +
                         `22. 2 Peter      23. 1 John       24. 2 John\n` +
                         `25. 3 John       26. Jude         27. Revelation\n\n` +
                         `📡 *CORE STAMP:* MILITAN System Interface`;

  // Fixed the execution so it actively sends your layout image with the text!
  await client.sendMessage(m.chat, {
    image: { url: "https://files.catbox.moe/3z1bml.png" },
    caption: messageCaption
  }, { quoted: m });
};