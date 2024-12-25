const zlib = require('zlib');

class CompressionService {
  async decompress(buffer, encoding) {
    if (!encoding) return buffer;

    try {
      switch (encoding.toLowerCase()) {
        case 'gzip':
          return await this.gunzip(buffer);
        case 'br':
          return await this.brotli(buffer);
        case 'deflate':
          return await this.inflate(buffer);
        default:
          return buffer;
      }
    } catch (error) {
      throw new Error(`Decompression failed: ${error.message}`);
    }
  }

  gunzip(buffer) {
    return new Promise((resolve, reject) => {
      zlib.gunzip(buffer, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  brotli(buffer) {
    return new Promise((resolve, reject) => {
      zlib.brotliDecompress(buffer, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  inflate(buffer) {
    return new Promise((resolve, reject) => {
      zlib.inflate(buffer, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}

module.exports = new CompressionService();