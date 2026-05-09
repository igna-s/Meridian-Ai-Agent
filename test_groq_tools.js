const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.split('\n').find(l => l.startsWith('GROQ_API_KEY=')).split('=')[1].trim();

const TOOLS = [
  { type: 'function', function: { name: 'create_file', description: 'Create a new file',
    parameters: { type:'object', properties: { name:{type:'string'}, content:{type:'string'} }, required:['name','content'] } } },
  { type: 'function', function: { name: 'run_file', description: 'Execute a file',
    parameters: { type:'object', properties: { name:{type:'string'} }, required:['name'] } } },
  { type: 'function', function: { name: 'run_command', description: 'Run a terminal command (e.g., "node file.js")',
    parameters: { type:'object', properties: { command:{type:'string'} }, required:['command'] } } },
];

async function test() {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a code agent. Create a JS file named test.js that logs "Hello from Azure", then use run_command with "node test.js" to run it.' },
        { role: 'user', content: 'Do it.' }
      ],
      tools: TOOLS,
      tool_choice: 'auto'
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.choices[0].message, null, 2));
}
test();
