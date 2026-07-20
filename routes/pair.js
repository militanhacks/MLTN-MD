const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { default: MLTNConnect, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

router.get("/pair", async (req, res) => {
  const number = req.query.number;
  if (!number) return res.status(400).send("Missing ?number=254712345678");

  const sessionId = "temp_" + Date.now();
  const tempDir = path.join(__dirname, "..", "temp_sessions", sessionId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(tempDir);

    const sock = MLTNConnect({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number.replace(/[^0-9]/g, ""));
      res.json({ pairingCode: code });
    }

    sock.ev.on("connection.update", async (update) => {
      const { connection } = update;
      if (connection === "open") {
        await new Promise((r) => setTimeout(r, 2000));
        const credsPath = path.join(tempDir, "creds.json");
        const credsData = fs.readFileSync(credsPath);
        const compressed = zlib.gzipSync(credsData);
        const b64 = compressed.toString("base64");
        const sessionString = `MLTN;;;${b64}`;

        console.log("✅ SESSION GENERATED:", sessionString);

        fs.rmSync(tempDir, { recursive: true, force: true });
        sock.end();
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

module.exports = router;
