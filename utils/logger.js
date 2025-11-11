// utils/logger.js
const ts = () => new Date().toLocaleTimeString(); // e.g., "14:07:32"

export const logger = {
  step: (...args) => console.log(`🪜 STEP |`, ...args),
  info: (...args) => console.log(`ℹ️ INFO |`, ...args),
  success: (...args) => console.log(`✅ OK   |`, ...args),
  warn: (...args) => console.warn(`⚠️ WARN |`, ...args),
  error: (...args) => console.error(`❌ ERR  |`, ...args),
  _ts, // if you ever need the raw timestamp
};
function _ts() { return ts(); }
