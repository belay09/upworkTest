export function formatUrl(input) {
  // If it's already a proxy URL, return as is
  if (input.startsWith('/proxy')) {
    return input;
  }

  // Clean the input URL
  let url = input;
  if (!url.match(/^https?:\/\//i)) {
    // Check if it's a domain-like input
    if (url.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)) {
      url = `https://${url}`;
    } else {
      // Treat as a search query
      return `/proxy?url=${encodeURIComponent(`https://www.google.com/search?q=${encodeURIComponent(input)}`)}`;
    }
  }

  // Return proxied URL
  return `/proxy?url=${encodeURIComponent(url)}`;
}