// Utility functions for HTML manipulation
function injectViewportMeta(html) {
  return html
    .replace(/<meta[^>]*viewport[^>]*>/gi, '')
    .replace(/<head>/i, `
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <base target="_self">
    `);
}

function removeFramebreaking(html) {
  return html
    .replace(/if\s*\(\s*top\s*!==\s*self\s*\)/g, 'if(false)')
    .replace(/if\s*\(\s*window\.top\s*!==\s*window\.self\s*\)/g, 'if(false)');
}

module.exports = { injectViewportMeta, removeFramebreaking };