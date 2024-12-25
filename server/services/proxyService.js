const { URL } = require('url');
const requestService = require('./requestService');
const compressionService = require('./compressionService');
const { injectViewportMeta, removeFramebreaking } = require('../utils/html');

class ProxyService {
  async makeRequest(url, maxRedirects = 5) {
    if (maxRedirects === 0) {
      throw new Error('Too many redirects');
    }

    try {
      const urlObj = new URL(url);
      const options = requestService.getRequestOptions(urlObj);
      const { response, buffer } = await requestService.makeRequest(urlObj, options);

      // Handle redirects
      if ([301, 302, 307, 308].includes(response.statusCode)) {
        const location = response.headers.location;
        if (!location) {
          throw new Error('Redirect without location header');
        }
        const redirectUrl = new URL(location, url).toString();
        return this.makeRequest(redirectUrl, maxRedirects - 1);
      }

      return this.processResponse(response, buffer);
    } catch (error) {
      throw new Error(`Proxy request failed: ${error.message}`);
    }
  }

  async processResponse(response, buffer) {
    try {
      const decoded = await compressionService.decompress(buffer, response.headers['content-encoding']);
      const contentType = response.headers['content-type'] || '';

      if (contentType.includes('text/html')) {
        const html = decoded.toString();
        const processed = removeFramebreaking(injectViewportMeta(html));
        return {
          headers: this.filterHeaders(response.headers),
          body: processed,
          type: 'html'
        };
      }

      return {
        headers: this.filterHeaders(response.headers),
        body: decoded,
        type: 'raw'
      };
    } catch (error) {
      throw new Error(`Failed to process response: ${error.message}`);
    }
  }

  filterHeaders(headers) {
    const blocked = [
      'content-security-policy',
      'x-frame-options',
      'strict-transport-security',
      'x-content-type-options'
    ];
    
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([key]) => !blocked.includes(key.toLowerCase()))
    );
  }
}

module.exports = new ProxyService();