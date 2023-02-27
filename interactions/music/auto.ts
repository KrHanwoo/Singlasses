import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../../bot';
import { BotUtil } from '../../utils/util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auto')
    .setDescription('Play music automatically')
    .setDMPermission(false),
  async execute(cmd: ChatInputCommandInteraction) {
    if (!cmd.guild) return cmd.err('Cannot get the guild');
    const queue = Bot.distube.getQueue(cmd.guild);
    if (!queue)return cmd.err('No music playing');
    const auto = queue.toggleAutoplay();
    cmd.reply({ embeds: [BotUtil.embed(`Autoplay turned ${auto ? 'on' : 'off'}`, auto ? BotUtil.EmbedType.PLAY : BotUtil.EmbedType.FAIL)] });
  },
};