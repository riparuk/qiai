# QIAI - Terminal Command Assistant

QIAI (Quick Assistant) is a program built with JavaScript and integrated with GPT-3.5. It's designed to help users with terminal commands related topic. It will give you simple short answer.

## Features
- **Token Saving**: Optimized prompts to reduce token usage, making it more efficient. (Avg 150 tokens per request)
- **OS-Specific Answers**: Provides answers specific to the operating system being used (Linux, macOS, Windows). (Windows not tested yet)

## How it Work
- set the openai api key to be able to access gpt, run `qiai --set-openai-api-key your-api-key`
- Ask a Question, by running `qiai -q "your question"`
- Demo
![QIAI Demo](./demo.gif)

## Installation
1. Install QIAI globally using npm:
   ```bash
   npm install -g qiai
   ```

## Todo 
- [ ] Support Gemini API
