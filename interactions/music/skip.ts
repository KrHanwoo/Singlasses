import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip music')
    .setDMPermission(false),
  async execute(cmd: ChatInputCommandInteraction) {
    if (!cmd.guild) return cmd.err('Cannot get the guild');
    const queue = Bot.distube.getQueue(cmd.guild);
    if (!queue) return cmd.err('No music playing');
    const skip = await queue.skip().catch(() => undefined);
    if (!skip) return cmd.err('No music to skip to');

    cmd.success('Skipped current music', false);
  },
};