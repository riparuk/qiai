import OpenAI from "openai";
import CLIAssistant from "./CLIAssistant.js";
import { displayTableSteps, ensureOpenaiApiKey } from "./helpers.js";
import { type, release, platform } from "os";

const os_information = `${type},${platform}:${release}`;

ensureOpenaiApiKey

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  const assistant = new CLIAssistant(openai, os_information);
  
  // Mengambil query dari argument baris perintah
  const query = process.argv.slice(2).join(" ");
  
  if (!query) {
    console.error("Error: Please provide a query. ex : qiai 'How to delete docker instance'");
    process.exit(1); // Keluar dengan status error jika tidak ada query
  }

  const response = await assistant.getCommands(query);
  console.log(response)
  displayTableSteps(response);
})();
