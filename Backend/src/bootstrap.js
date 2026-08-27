// Bootstrap: apply runtime shims before loading the main app
// Ensure older modules that expect SlowBuffer.prototype.equal work on new Node
import "dotenv/config";
if (typeof global.SlowBuffer === 'undefined') {
  global.SlowBuffer = Buffer;
}
if (typeof Buffer.prototype.equal === 'undefined' && typeof Buffer.prototype.equals === 'function') {
  Buffer.prototype.equal = Buffer.prototype.equals;
}

import './app.js';
