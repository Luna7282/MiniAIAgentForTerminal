# MiniAI Agent for Terminal

## Description
This project is an AI Assistant designed to help users with various tasks directly from the terminal. It follows a structured approach: START, THINK, ACTION, OBSERVE, and OUTPUT. The agent uses the Mistral AI API and incorporates tools to perform actions and provide useful outputs.

## Features
- Structured query resolution through step-by-step thinking
- Tool integration for extended functionality
- JSON-based communication protocol
- Logging of all agent interactions
- Command execution capabilities
- Ability to create files and scripts

## Project Structure
```
miniAgent/
├── .env                  # Environment variables (API keys)
├── .env.sample           # Sample environment file
├── index.ts              # Main application code
├── logs/                 # Interaction logs
├── output/               # Generated files and scripts
│   └── scripts/          # Generated bash scripts
└── README.md             # This documentation file
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Luna7282/MiniAIAgentForTerminal
   ```
2. Navigate to the project directory:
   ```bash
   cd MiniAIAgentForTerminal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy .env.sample to .env and add your Mistral API key:
   ```bash
   cp .env.sample .env
   # Then edit .env to add: MISTRAL_API_KEY=your_api_key_here
   ```

## Usage
1. Start the assistant:
   ```bash
   npm run dev
   ```
2. The agent will process the query defined in the index.ts file
3. View logs in the logs directory for agent thinking and actions

## How It Works
The agent follows these steps for processing each query:
1. **START**: User provides a query
2. **THINK**: Agent analyzes the query in multiple thinking steps
3. **ACTION**: Agent calls appropriate tools when needed
4. **OBSERVE**: Agent processes tool outputs
5. **OUTPUT**: Agent provides the final response

## Available Tools
- `getWeatherInfo(cityname:string)`: Get weather information for a specific city
- `executeCommand(command:any)`: Execute Linux commands on the user's device

## Examples
### Example 1: Get Weather Information
**User Query:**
```json
{"role":"user","content": "what is the weather of bhopal"}
```
**Assistant Response:**
```json
{"step":"think","content":"The User is asking for the weather of bhopal."}
{"step":"think","content":"From the available tool is there any tool that can give weather of bhopal,IF \"yes\" call the tool with input cityname here it is bhopal for example."}
{"step":"action","tool":"getWeatherInfo","input":"bhopal"}
{"step":"observe","content":"32 degree C."}
{"step":"think","content":"The output for getWeatherInfo(bhopal) is 32 degree C."}
{"step":"output","content":"Hey the weather of bhopal is 32 degree C which is quite hot "}
```

### Example 2: Create a Bash Script
The agent can create useful scripts like the animated text example in animated_text.sh

## Repository
[https://github.com/Luna7282/MiniAIAgentForTerminal](https://github.com/Luna7282/MiniAIAgentForTerminal)

