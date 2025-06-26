
export default class OpenAIAssistant {
  /**
  * Creates an instance of OpenAIAssistant.
  * @param {OpenAI} openai - An instance of OpenAI API client.
  * @param {string} os_information - Information about the operating system.
  */
  constructor(openai, os_information) {
    this.openai = openai;
    this.os_information = os_information;
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

Do not include any explanation or text outside of the JSON.
    `;
  }

  async getCommands(query) {
  // Constructing the messages array
  const messages = [
    // { role: "system", content: "You are an assistant for CLI terminals." },
    { role: "system", content: this.assistant_instruction },
    { role: "user", content: query }
  ];

  // Constructing the completion object
  const completion = {
    messages: messages,
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    max_tokens: 256,
  };

  // Assuming openai.chat.completions.create returns a Promise
  const response = await this.openai.chat.completions.create(completion);
  console.log("QIAI - tokens usage : ", response.usage.total_tokens)
  return JSON.parse(response.choices[0].message.content);
  }

}
