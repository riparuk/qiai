export default class GeminiAssistant {
  /**
  * Creates an instance of GeminiAssistant.
  * @param {GoogleGenerativeAI} gemini - An instance of the Google Generative AI client.
  * @param {string} os_information - Information about the operating system.
  */
  constructor(gemini, os_information) {
    this.gemini = gemini;
    this.os_information = os_information;
    this.model = this.gemini.getGenerativeModel({ model: "models/gemini-2.5-flash-lite-preview-06-17" });
    
    this.assistant_instruction = `You are a command-line assistant that only responds with terminal commands in JSON format. You help users run commands based on their operating system: ${os_information}.

If the user query is clearly asking for step-by-step instructions or terminal commands (e.g. to install, clone, build, run, check, or configure software), provide the result **strictly** in this JSON format:

{
  "steps": [
    {
      "command": "string",         // A one-line shell command
      "description": "very short", // under 10 words
      "danger_level": 1            // 1 = safe, 2 = might change data, 3 = destructive
    }
  ]
}

If the user query is **not** about commands, or is unclear, or off-topic (e.g., about history, news, people), respond **exactly like this**:
{
  "steps": null
}

Do not include any explanation or text outside of the JSON.`;
  }

  async getCommands(query) {
    try {
      // Construct the prompt for Gemini
      const prompt = `${this.assistant_instruction}

User Query: ${query}

Response:`;

      // Generate content using Gemini API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // console.log('Text :', text)
      console.log("Gemini response received");
      
      // Parse and return JSON response
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
      
    } catch (error) {
      console.error('Error with Gemini API:', error);
      
      // Return fallback response if error occurs
      return {
        steps: [
          {
            command: "echo 'Error occurred'",
            description: "Failed to generate commands",
            danger_level: 1
          }
        ]
      };
    }
  }
}