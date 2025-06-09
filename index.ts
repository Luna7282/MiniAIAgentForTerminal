import { Mistral } from "@mistralai/mistralai";
import { exec } from "child_process";
import { config } from "dotenv";
import {appendFileSync} from "fs"
config();

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  console.error("MISTRAL_API_KEY is not set in your environment variables.");
  process.exit(1);
}
function getWeatherInfo(cityname: any): any {
  return `${cityname} has 88 degree C`
}
function executeCommand(command:any){
  return new Promise((resolve,reject)=>{
    exec(command,function(err,stderr,stdout){
      if(err){
        return reject(err)
      }
      return resolve(`stdout:${stdout}\nstderr:${stderr}`)
    })
  })
}
const TOOLS_MAP= {
  getWeatherInfo:getWeatherInfo,
  executeCommand:executeCommand
}

const SYSTEM_PROMPT = `
You are an helpful AI Assistant who is designed to solve user query
Your work on START,THINK,ACTION,OBSERVE and OUTPUT mode.


In start phase , user give you a query.
Then ,you think how to resolve that query atleast 3-4 times and make sure all the inputs are taken in consideration.
if there is a need to call a tool, you can call the action event with tool and input parameters.
if there is an action call, wait for the OBSERVE that is ouput for the tool.
Based on the observation of previous output ,you either ouput or repeat the loop.

RULES:
-always wait for the next step.
-always output a single step and wait for the next step.
-output must be strictly JSON.
-Only call tool action from available tool only.
-strictly follow the output format in JSON.
-when ever you are called to create a file or script or project or anything like that there is a output folder put it there and also make it more specific like inside ouput for scripts you can make a folder and keep them also seperated like a folder for test script and a folder for shell scripts and same can be said for projects and else.

Available Tools:
-getWeatherInfo(cityname:string) : string
-executeCommand(command:any):string   Executes a given linux command on user device and return the stdout and stderr

Example:
START: What is the weather of bhopal ?
THINK: The User is asking for the weather of bhopal.
THINK: From the available tool is there any tool that can give weather of bhopal,IF "yes" call the tool with input cityname here it is bhopal for example.
ACTION: call tool getWeatherInfo(bhopal)
OBSERVE: 32 degree C.
THINK: The output for getWeatherInfo(bhopal) is 32 degree C.
OUTPUT: Hey the weather of bhopal is 32 degree C which is quite hot 

Ouptut Example:
{"role":"user","content": "what is the weather of bhopal"}
{"step":"think","content":"The User is asking for the weather of bhopal."}
{"step":"think","content":"From the available tool is there any tool that can give weather of bhopal,IF "yes" call the tool with input cityname here it is bhopal for example."}
{"step":"action","tool":"getWeatherInfo","input":"bhopal"}
{"step":"observe","content":"32 degree C."}
{"step":"think","content":"The output for getWeatherInfo(bhopal) is 32 degree C."}
{"step":"output","content":"Hey the weather of bhopal is 32 degree C which is quite hot "}

Output Format:
{"step":"string","tool":"string","input":"string","content":"string"}
`

const mistralClient = new Mistral({ apiKey });
const logFileName = `logs/run-log-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
function savelogs(data:any,filename=logFileName){
  const log = typeof data === "string" ? data : JSON.stringify({data},null,2)
  appendFileSync(filename,log +"\n",'utf-8')
}

async function init()  {
const message:Array<{role: "user"|"assistant"|"system", content: string,prefix?:boolean}> =[
  {
    role:"system",
    content:SYSTEM_PROMPT
  }
]
const user_query = "create a bash script in a new file to show me a interseting thing "
// const user_query = "Hey create a Readme file for this project the project you are running in try once and after readme create a modern looking multipage html css and js portfolio website with animations etc. and create it in a portfolio folder "
message.push({"role":"user","content":user_query})
while(true){
const response = await mistralClient.chat.complete({
        model: "mistral-medium",
      responseFormat:{type:"json_object"},
      messages:message
})
  message.push({'role':'user',content: `${response.choices[0].message.content},`})
  const parsed_response = JSON.parse(`${response.choices[0].message.content}`)

  if(parsed_response.step && parsed_response.step =="think"){
    console.log(`🧠 ${parsed_response.content}`);
    savelogs(`🧠 ${parsed_response.content}`)
    continue;
  }
   if(parsed_response.step && parsed_response.step =="output"){
    console.log(`🤖 ${parsed_response.content}`);
    savelogs(`🤖 ${parsed_response.content}`)
    break;
  }
  if(parsed_response.step && parsed_response.step =="action"){
    const tool = parsed_response.tool
    const input = parsed_response.input

    
    const value = TOOLS_MAP[tool as keyof typeof TOOLS_MAP](input)

    console.log(`🛠️ ${tool}:(${input}):${value}`);
    savelogs(`🛠️ ${tool}:(${input}):${value}`)
    message.push({
      "role":"user",
      "content":JSON.stringify({step:'observe',content:value})
    })
    continue;
  }
}
}

init();
