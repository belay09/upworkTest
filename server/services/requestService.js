const https = require('https');
const http = require('http');

class RequestService {
  makeRequest(urlObj, options) {
    return new Promise((resolve, reject) => {
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const request = protocol.request(options, (response) => {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve({ response, buffer: Buffer.concat(chunks) }));
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });

      request.on('error', (error) => {
        request.destroy();
        reject(error);
      });

      request.end();
    });
  }

  getRequestOptions(urlObj) {
    return {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Host': urlObj.hostname,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000,
      rejectUnauthorized: false
    };
  }
}

module.exports = new RequestService();