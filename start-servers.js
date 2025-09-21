const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to start a process
function startProcess(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });
  
  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data.toString().trim()}`);
  });
  
  proc.on('close', (code) => {
    console.log(`[${name}] process exited with code ${code}`);
  });
  
  return proc;
}

// Start backend
const backendPath = path.join(__dirname, 'backend');
const backendProcess = startProcess('npm', ['run', 'dev'], backendPath, 'Backend');

// Wait for backend to start before starting frontend
setTimeout(() => {
  // Start frontend
  const frontendPath = path.join(__dirname, 'frontend');
  const frontendProcess = startProcess('npm', ['start'], frontendPath, 'Frontend');
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
}, 3000);

console.log('Starting servers... Press Ctrl+C to stop');

