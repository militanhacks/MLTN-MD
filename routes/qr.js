const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const QRCode = require("qrcode");
const { default: MLTNConnect, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

router.get("/qr", async (req, res) => {
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

    let responded = false;

    sock.ev.on("connection.update", async (update) => {
      const { connection, qr } = update;

      if (qr && !responded) {
        responded = true;
        const qrImage = await QRCode.toDataURL(qr);
        res.send(`
          <html>
            <body style="text-align:center; font-family:sans-serif; background:#111; color:#fff; padding-top:50px;">
              <h2>Scan with WhatsApp</h2>
              <img src="${qrImage}" />
              <p>WhatsApp → Linked Devices → Link a Device</p>
            </body>
          </html>
        `);
      }

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
    if (!res.headersSent) res.status(500).send("Error: " + err.message);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

module.exports = router;
