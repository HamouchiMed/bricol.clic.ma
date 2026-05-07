const http = require('http');

const options = {
  hostname: '192.168.1.69',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000 // 5 seconds
};

console.log('Testing connection to backend at 192.168.1.69:3000...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
    console.log('\nSUCCESS: Connection is live.');
  });
});

req.on('error', (e) => {
  console.error(`ERROR: Problem with request: ${e.message}`);
});

req.on('timeout', () => {
  req.destroy();
  console.error('ERROR: Request timed out. Check firewall or IP settings.');
});

req.end();
