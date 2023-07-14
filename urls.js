const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

// Check if a filename is provided as a command-line argument
if (process.argv.length < 3) {
  console.log('Please provide a filename as a command-line argument.');
  process.exit(1);
}

// Get the filename from the command-line arguments
const filename = process.argv[2];

// Read the file and process each URL
fs.readFile(filename, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  const urls = data.split('\n').map((line) => line.trim());
  const promises = [];

  urls.forEach((urlString) => {
    if (urlString === '') return; // Skip empty lines

    const promise = new Promise((resolve, reject) => {
      const parsedUrl = new url.URL(urlString);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      const hostname = parsedUrl.hostname;

      if (!hostname) {
        console.error('Invalid URL:', urlString);
        reject(`Invalid URL: ${urlString}`);
        return;
      }

      const outputFile = `${hostname}`;

      const req = protocol.get(urlString, (res) => {
        let html = '';

        res.on('data', (chunk) => {
          html += chunk;
        });

        res.on('end', () => {
          fs.writeFile(outputFile, html, 'utf8', (err) => {
            if (err) {
              console.error(`Error writing file ${outputFile}:`, err);
              reject(`Error writing file ${outputFile}`);
            } else {
              console.log(`Wrote to ${outputFile}`);
              resolve();
            }
          });
        });
      });

      req.on('error', (err) => {
        console.error(`Couldn't download ${urlString}`);
        req.abort(); // Abort the request to prevent hanging on failed requests
        reject(`Couldn't download ${urlString}`);
      });
    });

    promises.push(promise);
  });

  try {
    await Promise.all(promises);
    console.log('All URLs processed.');
  } catch (error) {
    console.error('Error:', error);
  }
});
