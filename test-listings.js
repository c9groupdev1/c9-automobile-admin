const http = require('http');

http.get('http://localhost:3000/api/listings', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.data.data[0], null, 2));
    } catch(e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Raw data:', data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.log('Error:', e.message);
});
