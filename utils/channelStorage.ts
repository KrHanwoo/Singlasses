import { Guild, GuildTextBasedChannel } from "discord.js";
import { Bot } from "../bot";

export class ChannelStorage {
  static guild: Guild;
  static test: GuildTextBasedChannel;

  static async initialize() {
    this.guild = await Bot.client.guilds.fetch(Bot.config.guild);
    // getChannel(Bot.config.channel.test).then(x => this.test = x);
    console.log('Channels initialized');
    //fetchMembers();
  }
}

async function getChannel(id: string): Promise<GuildTextBasedChannel> {
  return await Bot.client.channels.fetch(id) as GuildTextBasedChannel;
}

async function fetchMembers(){
  await ChannelStorage.guild.members.fetch();
  console.log('Members fetched');
}