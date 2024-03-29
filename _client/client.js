const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function sendCommand(command) {
  const commandObject = { command };

  /**
   * ⚠ Add the hostname only.
   * Example abc.vercel.app excluding `https://`
   */

  const options = {
    hostname: 'add-your-server-hostname',
    path: '/api',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = https.request(options, (res) => {
    // console.log("yooo bishes", res)
    // res.on('data', (data) => {
    //   console.log(data.toString());
    // });

    // res.on('end', () => {
    //   promptForCommand(); // Prompt for next command
    // });
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response data: \n \n%s', responseData);
      console.log('\n')
      promptForCommand(); 
    });
  });

  req.on('error', (error) => {
    console.error(`Error sending command: ${error.message}`);
    rl.close();
  });

  req.write(JSON.stringify(commandObject)); 
  req.end();
}

function promptForCommand() {
  rl.question('Enter command: ', (command) => {
    sendCommand(command.trim());
  });
}

promptForCommand();
