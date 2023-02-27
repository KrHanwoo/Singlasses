import Discord, { GatewayIntentBits } from 'discord.js';
import config from './config.json';
import fs from 'fs';
import { ExtUtil } from './utils/extUtil';
import DisTube from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { DistubeEvents } from './utils/distubeEvents';

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.DirectMessages,
  ],
});
export class Bot {
  public static readonly config = config;
  public static readonly client = client;
  public static readonly distube = new DisTube(client, {
    leaveOnStop: false,
    nsfw: true,
    plugins: [
      new YtDlpPlugin()
    ]
  });
}

ExtUtil.initialize();

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, async (...args) => event.execute(...args));
}

DistubeEvents.initialize();

console.log(new Date().toLocaleDateString());
client.login(config.token).then(() => {
  console.log(`Logged as ${Bot.client.user?.username}`);
});
