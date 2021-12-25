# XRemote JS

[![codecov](https://codecov.io/gh/yowari/xremote-js/branch/main/graph/badge.svg)](https://codecov.io/gh/yowari/xremote-js)

XRemote is a web implementation for the Xbox One/Series streaming protocol.

The package provides API to access and collect stream data of your Xbox console.

# Usage

You can install `@yowari/xremote` package using npm:

```
npm install @yowari/xremote
```

After install finishes, you can use the provided API to connect to your Xbox console:

```typescript
import { Buttons, Client, VIDEO_CHANNEL } from '@yowari/xremote';

const OAUTH_TOKEN = 'secret-token'; // retrieve your token from https://www.xbox.com/en-US/play

const client = new Client();
await client.login(OAUTH_TOKEN);
const consoles = await client.getConsoles();
const session = await client.createSession(consoles.results[0].serverId);
await client.startStream(session.sessionId);

// Get video stream
const videoChannel = client.getChannel(VIDEO_CHANNEL);
videoChannel.addEventListener('frame', (event) => {
  // render(event.frame)
});

// Control the gamepad
const gamepadManager = client.getGamepadManager();
gamepadManager.pressButton(0, Buttons.Nexus);
setTimeout(() => gamepadManager.releaseButton(0, Buttons.Nexus), 25);
```

# Develop

For easy environment setup, use `nvm` with the command bellow

```
nvm use
```

This will set the appropriate node version defined in `.nvmrc`.

The project source code is written in TypeScript. To transpile the code and build the production bundle, run
the following command:

```
npm run build
```

The project uses Jest for tests. Use the command bellow to run the tests:

```
npm run test
```

# Credit

- [UnknownSKL](https://github.com/unknownskl/xbox-xcloud-client) for doing nearly all the reverse engineering
- [Team OpenXbox](https://openxbox.org/) for creating an awesome community
