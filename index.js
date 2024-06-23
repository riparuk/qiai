import OpenAI from "openai";
import CLIAssistant from "./CLIAssistant.js";
import { displayTableSteps } from "./helpers.js";
import { type, release, platform } from "os";
import config from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const os_information = `${type},${platform}:${release}`;

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

(async () => {
  argsSetup();
  ensureOpenaiApiKey();
})();

async function argsSetup() {
  // get arguments 
  const args = process.argv.slice(2);
  // console.log(args)

  // Resolve the path to config.json relative to the current module file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.resolve(__dirname, 'config.json');

  // if -q called, mean the user ask question
  if (args.includes('-q')) {
    const questionIndex = args.indexOf('-q') + 1;
    if (questionIndex < args.length) {
      const query = args[questionIndex];
      if (!query) {
        console.log("Please provide a query. ex : qiai 'How to delete docker instance'");
        process.exit(0);
      }
      
      const assistant = new CLIAssistant(openai, os_information);

      const response = await assistant.getCommands(query);
      // console.log(response)
      displayTableSteps(response);

      process.exit(0);
    } else {
      console.error('Provide a query value after -q option');
      process.exit(1);
    }
  }

  // if --set-api-key called
  if (args.includes('--set-openai-api-key')) {
    const apiKeyIndex = args.indexOf('--set-openai-api-key') + 1;
    if (apiKeyIndex < args.length) {
      config.openaiApiKey = args[apiKeyIndex];
      if (!args[apiKeyIndex]) {
        console.log("Please provide a valid api key.");
        process.exit(0);
      }

      // Save back the configuration
      try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        console.log('API Key has been set.');
      } catch (error) {
        console.error('Failed to save API Key:', error.message);
      }

      process.exit(0);
    } else {
      console.error('Provide API Key value after --set-openai-api-key.');
      process.exit(1);
    }
  }

  // If no using any option are provided, display documentation
  console.log("Usage:");
  console.log("  qiai -q 'your question'")
  console.log("  qiai --set-api-key your-api-value ");
  process.exit(0); // Exit gracefully after displaying documentation
  
}


/**
 * Function to ensure that the QIAI_OPENAI_API_KEY is set either in environment variables or config file.
 * Throws an error and exits the process if the API key is not found or not valid.
 */
function ensureOpenaiApiKey() {
  // Mengecek keberadaan API key dalam konfigurasi
  if (!config.openaiApiKey) {
      console.error('Error: openai-api-key is not set yet');
      console.error('Please set the openai-api-key before running the program');
      console.error('run : qiai --set-openai-api-key your-api-key')
      process.exit(1); 
  }
}
