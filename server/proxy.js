const proxyService = require('./services/proxyService');
const { filterHeaders } = require('./utils/headers');
const zlib = require('zlib');

async function handleProxyRequest(req, res) {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const result = await proxyService.makeRequest(url);
    
    // Set filtered response headers
    const filteredHeaders = filterHeaders(result.headers);
    Object.entries(filteredHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Decompress response if necessary
    let responseBody = result.body;
    const encoding = result.headers['content-encoding'];
    console.log('Response encoding:', encoding);
    console.log('Response body type:', typeof responseBody);
    console.log('Response body before decompression:', responseBody);

    try {
      if (Buffer.isBuffer(responseBody)) {
        if (encoding === 'gzip') {
          responseBody = zlib.gunzipSync(responseBody);
        } else if (encoding === 'deflate') {
          responseBody = zlib.inflateSync(responseBody);
        } else if (encoding === 'br') {
          responseBody = zlib.brotliDecompressSync(responseBody);
        }
      } else {
        console.warn('Response body is not a Buffer, skipping decompression');
      }
    } catch (decompressionError) {
      console.error('Decompression error:', decompressionError.message);
      throw new Error('Decompression failed');
    }

    console.log('Response body after decompression:', responseBody,'type:', typeof responseBody);

    // Convert Buffer to string if necessary
    if (Buffer.isBuffer(responseBody)) {
      responseBody = responseBody.toString('utf-8');
    }

    // Send response
    if (result.type === 'html') {
      res.send(responseBody);
    } else {
      res.end(responseBody);
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}

module.exports = { handleProxyRequest };