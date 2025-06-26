import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAIAssistant from "./assistants/OpenAIAssistant.js";
import GeminiAssistant from "./assistants/GeminiAssistant.js";
import { displayTableSteps } from "./utils/helpers.js";
import { type, release, platform } from "os";
import config from './config/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const os_information = `${type()}, ${platform()}:${release()}`;

// Initialize clients only if API keys are available
let openai, gemini;

if (config.openaiApiKey && config.openaiApiKey.trim() !== '') {
  openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });
}

if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
  gemini = new GoogleGenerativeAI(config.geminiApiKey);
}

(async () => {
  argsSetup();
  ensureApiKeys();
})();

async function argsSetup() {
  const args = process.argv.slice(2);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.resolve(__dirname, 'config/config.json');

  if (args.includes('-q')) {
    const questionIndex = args.indexOf('-q') + 1;
    if (questionIndex < args.length) {
      const query = args[questionIndex];
      if (!query) {
        console.log("Please provide a query. ex : qiai -q 'How to delete docker instance'");
        process.exit(0);
      }

      // Auto-select provider based on available API keys
      let assistantType;
      let response;

      // Check manual override first
      if (args.includes('--gemini')) {
        assistantType = 'gemini';
      } else if (args.includes('--openai')) {
        assistantType = 'openai';
      } else {
        // Auto-select based on available API keys
        assistantType = getAvailableProvider();
      }

      console.log(`Using ${assistantType.toUpperCase()} provider...`);

      if (assistantType === 'gemini') {
        const assistant = new GeminiAssistant(gemini, os_information);
        response = await assistant.getCommands(query);
      } else {
        const assistant = new OpenAIAssistant(openai, os_information);
        response = await assistant.getCommands(query);
      }

      displayTableSteps(response);
      process.exit(0);
    } else {
      console.error('Provide a query value after -q option');
      process.exit(1);
    }
  }

  if (args.includes('--set-openai-api-key')) {
    const apiKeyIndex = args.indexOf('--set-openai-api-key') + 1;
    if (apiKeyIndex < args.length) {
      if (!args[apiKeyIndex]) {
        console.log("Please provide a valid API key.");
        process.exit(0);
      }

      try {
        // Baca config yang sudah ada dari file
        let existingConfig = {};
        try {
          const configFile = fs.readFileSync(configPath, 'utf8');
          existingConfig = JSON.parse(configFile);
        } catch (error) {
          // Jika file tidak ada, buat object kosong
          existingConfig = {};
        }

        // Update OpenAI API key dan set sebagai default
        existingConfig.openaiApiKey = args[apiKeyIndex];
        existingConfig.defaultProvider = 'openai'; // Auto set as default
        
        // Tulis kembali ke file
        fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2), 'utf8');
        console.log('OpenAI API Key has been set.');
        console.log('OpenAI is now set as the default provider.');
      } catch (error) {
        console.error('Failed to save OpenAI API Key:', error.message);
      }

      process.exit(0);
    } else {
      console.error('Provide API Key value after --set-openai-api-key.');
      process.exit(1);
    }
  }

  if (args.includes('--set-gemini-api-key')) {
    const apiKeyIndex = args.indexOf('--set-gemini-api-key') + 1;
    if (apiKeyIndex < args.length) {
      if (!args[apiKeyIndex]) {
        console.log("Please provide a valid API key.");
        process.exit(0);
      }

      try {
        // Baca config yang sudah ada dari file
        let existingConfig = {};
        try {
          const configFile = fs.readFileSync(configPath, 'utf8');
          existingConfig = JSON.parse(configFile);
        } catch (error) {
          // Jika file tidak ada, buat object kosong
          existingConfig = {};
        }

        // Update Gemini API key dan set sebagai default
        existingConfig.geminiApiKey = args[apiKeyIndex];
        existingConfig.defaultProvider = 'gemini'; // Auto set as default
        
        // Tulis kembali ke file
        fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2), 'utf8');
        console.log('Gemini API Key has been set.');
        console.log('Gemini is now set as the default provider.');
      } catch (error) {
        console.error('Failed to save Gemini API Key:', error.message);
      }

      process.exit(0);
    } else {
      console.error('Provide API Key value after --set-gemini-api-key.');
      process.exit(1);
    }
  }

  if (args.includes('--set-default-provider')) {
    const providerIndex = args.indexOf('--set-default-provider') + 1;
    if (providerIndex < args.length) {
      const provider = args[providerIndex];
      if (!provider || !['openai', 'gemini'].includes(provider)) {
        console.log("Please provide a valid provider: 'openai' or 'gemini'");
        process.exit(0);
      }

      try {
        // Baca config yang sudah ada
        let existingConfig = {};
        try {
          const configFile = fs.readFileSync(configPath, 'utf8');
          existingConfig = JSON.parse(configFile);
        } catch (error) {
          existingConfig = {};
        }

        // Set default provider
        existingConfig.defaultProvider = provider;
        
        // Tulis kembali ke file
        fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2), 'utf8');
        console.log(`Default provider manually set to: ${provider.toUpperCase()}`);
      } catch (error) {
        console.error('Failed to save default provider:', error.message);
      }

      process.exit(0);
    } else {
      console.error('Provide provider value after --set-default-provider (openai|gemini)');
      process.exit(1);
    }
  }

  console.log("Usage:");
  console.log("  qiai -q 'your question'                    # Auto-select available provider");
  console.log("  qiai -q 'your question' --openai           # Force use OpenAI");
  console.log("  qiai -q 'your question' --gemini           # Force use Gemini");
  console.log("  qiai --set-openai-api-key your-api-value   # Set OpenAI key (becomes default)");
  console.log("  qiai --set-gemini-api-key your-api-value   # Set Gemini key (becomes default)");
  console.log("  qiai --set-default-provider openai|gemini  # Manually set default provider");
  process.exit(0);
}

function getAvailableProvider() {
  // Check if default provider is set in config
  const defaultProvider = config.defaultProvider;
  
  if (defaultProvider === 'gemini' && config.geminiApiKey && config.geminiApiKey.trim() !== '') {
    return 'gemini';
  } else if (defaultProvider === 'openai' && config.openaiApiKey && config.openaiApiKey.trim() !== '') {
    return 'openai';
  }
  
  // Fallback to first available if default not available
  if (config.openaiApiKey && config.openaiApiKey.trim() !== '') {
    return 'openai';
  } else if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
    return 'gemini';
  } else {
    console.error('Error: No API keys are configured');
    console.error('Please set at least one API key:');
    console.error('  qiai --set-openai-api-key your-openai-key');
    console.error('  qiai --set-gemini-api-key your-gemini-key');
    process.exit(1);
  }
}

function ensureApiKeys() {
  // Check if at least one API key is available
  const hasOpenAI = config.openaiApiKey && config.openaiApiKey.trim() !== '';
  const hasGemini = config.geminiApiKey && config.geminiApiKey.trim() !== '';
  
  if (!hasOpenAI && !hasGemini) {
    console.error('Error: No API keys are configured');
    console.error('Please set at least one API key before running:');
    console.error('  qiai --set-openai-api-key your-openai-key');
    console.error('  qiai --set-gemini-api-key your-gemini-key');
    process.exit(1);
  }
}
