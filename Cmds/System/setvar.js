const { setSetting } = require('../Utility/settingsdb');
module.exports = async (context) => {
  const { m, text } = context;

  const input = text.split('=');

  let key, value;

  if (input.length === 1) {
    key = 'AUTOVIEW_STATUS';
    value = input[0].trim();
  } else if (input.length === 2) {
    [key, value] = input.map((str) => str.trim());
  } else {
    return m.reply(
      '⛔ *Incorrect Usage, mortal.*\nExample:\n.setvar ANTIBOT=TRUE\nOr to set AUTOVIEW_STATUS directly:\n.setvar true'
    );
  }

  try {
    await setSetting(key, value);
    await m.reply(
      `⛓️ *Decree carved into the Vault:* ${key} = ${value}\n🌑 The change takes hold immediately — no restart required.`
    );
  } catch (error) {
    console.error('Error setting variable:', error);
    await m.reply(
      '💀 *The Vault rejected this decree.* Try again later.\n' + error.message
    );
  }
};