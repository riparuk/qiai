
export default class CLIAssistant {
  /**
  * Creates an instance of CLIAssistant.
  * @param {OpenAI} openai - An instance of OpenAI API client.
  * @param {string} os_information - Information about the operating system.
  */
  constructor(openai, os_information) {
    this.openai = openai;
    this.os_information = os_information;
    this.assistant_instruction = `Provide commonly used commands based on OS ${os_information}. Keep it very minimum, Only in a JSON format, Always null json if talk about other topic.
        "steps": [
            {
                "command": "string",
                "description": "very short",
                "danger_level": (1-3)
            }
        ],
    }
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
