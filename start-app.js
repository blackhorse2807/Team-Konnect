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
    if (code !== 0) {
      console.log(`[${name}] process exited with code ${code}`);
    }
  });
  
  proc.on('error', (error) => {
    console.error(`[${name}] Failed to start: ${error.message}`);
  });
  
  return proc;
}

// First kill any processes that might be using our ports
console.log('Killing any processes using our ports...');
const killProcess = startProcess('node', ['kill-ports.js'], __dirname, 'Kill Ports');

killProcess.on('close', (code) => {
  console.log('Port cleanup completed.');
  
  // Wait a moment before starting servers
  setTimeout(() => {
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
    }, 5000);
  }, 2000);
});

console.log('Starting application... Please wait...');

