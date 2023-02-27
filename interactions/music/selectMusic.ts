import { MessageComponentInteraction, GuildMember } from 'discord.js';
import { Bot } from '../../bot';

module.exports = {
  id: 'search-select',
  async execute(cmd: MessageComponentInteraction) {
    const member = cmd.member;
    if (!(member instanceof GuildMember)) return cmd.err('Only members can use this command');
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return cmd.err('You need to join a voice channel to play music');

    let url: string;
    try {
      const num = Number.parseInt(cmd.customId.replace('search-select-', ''));
      const field = cmd.message.embeds[0]?.fields[num - 1];
      url = field?.value.split('](')[1]?.split(')')[0];
    } catch (e) {
      cmd.err('Failed to play music');
      return;
    }

    await cmd.deferReply();
    Bot.distube.play(voiceChannel, url, { member: member, metadata: cmd });
  },
};