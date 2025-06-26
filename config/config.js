import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'config.json');

let config = {};

try {
  const configFile = readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading or parsing config file:', error.message);
}

export default config;
