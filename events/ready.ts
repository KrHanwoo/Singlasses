import { ApplicationCommandManager, GuildApplicationCommandManager } from 'discord.js';
import { Bot } from '../bot.js';
import { ChannelStorage } from '../utils/channelStorage.js';
import { InteractionHandler } from '../utils/interactionHandler.js';

module.exports = {
  name: 'ready',
  async execute() {
    await ChannelStorage.initialize();

    const guildCommandManager = ChannelStorage.guild.commands;
    const globalCommandManager = Bot.client.application?.commands;
    let commands = guildCommandManager;
    if (commands === undefined) throw Error('Failed to get command manager');

    // await resetCommands(commands);

    await InteractionHandler.register(commands);
    console.log('Bot is ready!');
  }
};

async function resetCommands(manager: ApplicationCommandManager | GuildApplicationCommandManager) {
  console.log('Resetting commands');
  let commands;
  if (manager instanceof GuildApplicationCommandManager) commands = await manager.fetch();
  else if (manager instanceof ApplicationCommandManager) commands = await manager.fetch();
  if (commands === undefined) return console.error('Failed to reset commands');
  for (const cmd of commands) {
    await cmd[1].delete();
  }
  console.log('Commands reset');
}