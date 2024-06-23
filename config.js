// config.js
import { readFileSync } from 'fs';
import path from 'path';

const configPath = path.resolve(new URL('./config.json', import.meta.url).pathname);

let config = {};

try {
  const configFile = readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading or parsing config file:', error.message);
}

export default config;