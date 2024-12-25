function filterHeaders(headers) {
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

function getRequestHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Mode': 'navigate'
  };
}

module.exports = { filterHeaders, getRequestHeaders };