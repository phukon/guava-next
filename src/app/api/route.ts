import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
 try {
    const data = await req.json();
    const command = data.command;
    console.log(`Received command: ${command}`);

    const shellCommand = process.platform === 'win32' ? 'cmd' : 'bash';
    const child = spawn(shellCommand, ['-c', command]);

    let procData: string = '';
    let procError: string = '';

    child.stdout.on('data', (output) => {
      procData += output.toString();
    });

    child.stderr.on('data', (error) => {
      procError += error.toString();
    });

    // Write the command to stdin and then close it
    child.stdin.write(command + '\n');
    child.stdin.end();

    // Wait for the child process to close
    const processClosed = new Promise<number>((resolve, reject) => {
      child.on('error', (error) => {
        console.error(`Error spawning child process: ${error.message}`);
        reject(error);
      });

      child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(code || 0);
      });
    });

    try {
      await processClosed;
    } catch (error) {
      console.error(`Error from child process: ${error}`);
      return new NextResponse(procError || 'Internal Server Error', { status: 500 });
    }

    if (procError) {
      console.error(`Error from child process: ${procError}`);
      return new NextResponse(procError, { status: 500 });
    }

    return new NextResponse(procData, { status: 200 });
 } catch (error) {
    console.error(`Error processing command: ${(error as Error).message}`);
    return new NextResponse('Internal Server Error', { status: 500 });
 }
}
