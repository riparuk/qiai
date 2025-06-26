# QIAI - Terminal Command Assistant

QIAI (Quick Assistant) is a CLI tool that helps you get relevant terminal commands quickly using AI (OpenAI GPT & Google Gemini).

## Installation

```bash
npm install -g qiai
```

## Quick Start

### 1. Set up API Keys
You need at least one API key to use QIAI:

```bash
# Set OpenAI API key (becomes default)
qiai --set-openai-api-key your-openai-api-key

# Or set Gemini API key (becomes default)
qiai --set-gemini-api-key your-gemini-api-key
```

### 2. Ask Questions
```bash
# Auto-select available provider
qiai -q "how to list files in directory"

# Force specific provider
qiai -q "how to install docker" --openai
qiai -q "how to install docker" --gemini
```

## Usage

### Basic Commands
```bash
# Ask any command-related question
qiai -q "your question"                    # Auto-select provider
qiai -q "your question" --openai           # Force OpenAI
qiai -q "your question" --gemini           # Force Gemini

# API key management
qiai --set-openai-api-key your-api-key     # Set OpenAI key
qiai --set-gemini-api-key your-api-key     # Set Gemini key

# Provider management
qiai --set-default-provider openai|gemini  # Set default provider
```

### Provider Management
The last API key you set automatically becomes the default provider:

```bash
# Set OpenAI key - becomes default
qiai --set-openai-api-key your-key

# Set Gemini key - becomes default  
qiai --set-gemini-api-key your-key

# Manually override default
qiai --set-default-provider openai
qiai --set-default-provider gemini
```

## Examples

### Docker Commands
```bash
$ qiai -q "how to stop all docker containers"
Using GEMINI provider...
┌─────────────────────────────────┬─────────────────────┬──────────────┐
│ COMMAND                         │ DESCRIPTION         │ DANGER_LEVEL │
├─────────────────────────────────┼─────────────────────┼──────────────┤
│ docker stop $(docker ps -q)    │ Stop all containers │ Level 2      │
└─────────────────────────────────┴─────────────────────┴──────────────┘
```

### Git Commands
```bash
$ qiai -q "clone laravel project"
Using OPENAI provider...
┌─────────────────────────────────────┬─────────────────────────┬──────────────┐
│ COMMAND                             │ DESCRIPTION             │ DANGER_LEVEL │
├─────────────────────────────────────┼─────────────────────────┼──────────────┤
│ composer create-project laravel/... │ Create Laravel project  │ Level 1      │
│ cd my-project && php artisan serve  │ Start dev server        │ Level 1      │
└─────────────────────────────────────┴─────────────────────────┴──────────────┘
```

### System Commands
```bash
$ qiai -q "check disk usage"
$ qiai -q "find large files"
$ qiai -q "kill process by name"
$ qiai -q "compress folder to zip"
```

## Response Format

QIAI returns commands in a structured table format:
- **Command**: The actual terminal command to run
- **Description**: Brief explanation of what the command does  
- **Danger Level**: Safety indicator
  - Level 1: Safe commands (read-only, basic operations)
  - Level 2: Commands that might change data
  - Level 3: Potentially destructive commands

## API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Set it: `qiai --set-openai-api-key your-key`

### Google Gemini API Key  
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Set it: `qiai --set-gemini-api-key your-key`

## Features

- **Multi-AI Support**: Works with both OpenAI GPT and Google Gemini
- **Auto Provider Selection**: Automatically uses available AI provider
- **OS-Specific**: Provides commands for your operating system (Windows, macOS, Linux)
- **Smart Responses**: Returns organized commands with safety levels
- **Token Optimized**: Efficient prompts to reduce API costs

## Troubleshooting

### Command Not Found
```bash
# Reinstall globally
npm install -g qiai

# Check installation
which qiai
```

### API Errors
- Verify your API keys are valid
- Check your internet connection
- Ensure you have API credits/quota available

### No Response
- Make sure your question is about terminal commands
- Try rephrasing your question
- Check if the provider is working: `qiai -q "list files" --openai`

## More Examples

```bash
# Development
qiai -q "start a local python web server"
qiai -q "install node modules"
qiai -q "run database migration with express"

# System Administration  
qiai -q "check system memory"
qiai -q "monitor network traffic"
qiai -q "backup directory"

# File Operations
qiai -q "copy files recursively"
qiai -q "find files by extension"
qiai -q "change file permissions"
```