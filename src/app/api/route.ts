import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON data from the request body
    const data = await req.json();
    const command = data.command;
    console.log(`Received command: ${command}`);

    const shellCommand = process.platform === 'win32' ? 'cmd' : 'bash';
    const child = spawn(shellCommand);

    let procData: string = '';
    const processClosed = new Promise<number>((resolve, _) => {
      child.stdout.on('data', (output) => {
        procData += output.toString();
      });

      child.on('error', (error) => {
        console.error(`Error spawning child process: ${error.message}`);
        procData += error;
      });


      child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(code || 0); 
      });
    });

    child.stdin.write(command + '\n');
    child.stdin.end();

    await processClosed;

    return new NextResponse(procData, { status: 200 });
  } catch (error) {
    console.error(`Error processing command: ${(error as Error).message}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
