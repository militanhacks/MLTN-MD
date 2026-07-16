// Shared mutable bot state — lets commands change settings at runtime
// without needing a restart. Resets to env var defaults on redeploy.
const botState = {
  mode: process.env.MODE || 'public',
};

module.exports = botState;