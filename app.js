import express from 'express';
import { appendFile } from 'fs/promises';
import requestIp from 'request-ip';
import axios from 'axios';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(requestIp.mw());

const path = join(__dirname, 'index.html');

app.get('/', async (req, res) => {
  try {
    // Get client's IP address from the request
    const clientIp = req.clientIp;
    console.log(clientIp);
    // Save IP address to a file
    await appendFile('ip_logs.txt', `${clientIp}\n`);

    console.log(`IP Address ${clientIp} saved to ip_logs.txt`);

    // Get location information using IPinfo API
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=fae7f1690e1354`);
    const location = ipinfoResponse.data;

    console.log('Location Information:', location);

    res.status(200).json({ success: true, location });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
