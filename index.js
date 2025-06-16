
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const channelId = '0029Valhf2Y5q08dA7PDHI1Y@broadcast'; // ID Saluran kamu

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

client.on('qr', qr => {
  console.log('Scan QR ini di WhatsApp kamu:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot siap!');
});

app.get('/', (req, res) => {
  res.send('Bot WhatsApp aktif!');
});

// Endpoint kirim pesan
app.post('/kirim', express.json(), async (req, res) => {
  try {
    const pesan = req.body.pesan;
    await client.sendMessage(channelId, pesan);
    console.log('Pesan dikirim:', pesan);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

client.initialize();
app.listen(port, () => {
  console.log(`Server aktif di http://localhost:${port}`);
});
