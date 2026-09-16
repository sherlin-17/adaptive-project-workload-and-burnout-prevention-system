const https = require('https');
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env.local');
  const env = fs.readFileSync(envPath, 'utf8');
  const lines = env.split('\n');
  const keys = {};
  for (const line of lines) {
    if (line.includes('=')) {
      const [key, ...val] = line.split('=');
      keys[key.trim()] = val.join('=').trim().replace(/"/g, '');
    }
  }

  const data = JSON.stringify({
    service_id: keys.VITE_EMAILJS_SERVICE_ID,
    template_id: keys.VITE_EMAILJS_TEMPLATE_ID,
    user_id: keys.VITE_EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: "test@example.com",
      to_name: "Test User",
      otp: "123456"
    }
  });

  console.log("Testing with Service:", keys.VITE_EMAILJS_SERVICE_ID, "Template:", keys.VITE_EMAILJS_TEMPLATE_ID);

  const options = {
    hostname: 'api.emailjs.com',
    path: '/api/v1.0/email/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response Body:', body);
    });
  });

  req.on('error', (e) => console.error("Request Error:", e));
  req.write(data);
  req.end();
} catch (e) {
  console.error("Setup Error:", e);
}
