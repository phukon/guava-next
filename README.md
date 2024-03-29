<img alt=" Interact with your Vercel deployment's build container through it's bash terminal." src="https://github.com/phukon/guava-next/assets/60285613/c860bcfa-49e2-41ce-86cb-d2b7373d2590">

<h3 align="center">guava-term + Next.js</h3>

<p align="center">
    Interact with your Vercel deployment's build container through it's bash terminal
    <br />
    <a href="#http-implementation"><strong>HTTP</strong></a> ·
    <a href=""><strong>guava-term</strong></a> ·
</p>

<br/>

This project enables remote interaction with a Vercel Build container through it's bash terminal using child processes. I initially wrote this to explore the remote environment and use the `/temp` directory of a Vercel Build Docker container. {see more @ [Vercel Builds](https://vercel.com/docs/deployments/builds) }

For a simple Node.js implementation with http, and webhook, check [guava-term](https://github.com/phukon/guava-term)

## HTTP implementation

Everything is stateless on the `HTTP` implementation. The `child process` is killed after every command or should I say for every new command, a new `child process` is spun up.

### Extra feature
- Patched the `/node_modules/next/dist/server/lib/start-server.js` to enable rich logging.
- The logs are stored in your OS's temp dir.
- Patches are defined in the `patches` dir of this repo. These are automatically applied after the install command. { `"postinstall": "patch-package"` @ `package.json`}

### HTTP

1.  `npm install`

### Websocket

Vercel currently doesn't support websockets, therefore I haven't added support for websockets in this Next.js app.
{see Node.js guava-term websocket implementation @ [guava-term](https://github.com/phukon/guava-term?tab=readme-ov-file#websocket)}

### Usage

 Run the dev server: `npm run dev`

#### Client Side

1. Add hostname in the options in `client/client.js`
2. Run the client: `node client.js` This will prompt you to enter a command.
3. Enter the desired command and press Enter. The command will be sent to the server, executed in a bash terminal, and the output will be displayed in the client console.

## The patch

```javscript
const os = require('os');
const _logger = require("pino-http")({
  transport: {
    target: "pino/file",
    options: {
      destination: `${os.tmpdir()}`,
      mkdir: true,
      all: true,
      translateTime: true,
    },
  },
});
```

```
// used inside requestListener {@ node_modules/next/dist/server/lib/start-server.js}
_logger(req, res);
```
