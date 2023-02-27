import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, escapeMarkdown } from 'discord.js';
import ytdl from '@distube/ytdl-core';
import { Bot } from '../../bot';
import { BotUtil } from '../../utils/util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .setDMPermission(false)
    .addStringOption(o => o
      .setName('music')
      .setDescription('Music to play')
      .setRequired(true)
    ),
  async execute(cmd: ChatInputCommandInteraction) {
    const member = cmd.member;
    if (!(member instanceof GuildMember)) return cmd.err('Only members can use this command');
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return cmd.err('You have to join a voice channel to use this command');
    const options = cmd.options;
    const query = options.getString('music', true);

    if (ytdl.validateURL(query)) {
      await cmd.deferReply();
      return Bot.distube.play(voiceChannel, query, { member: member, metadata: cmd });
    }

    const search = await Bot.distube.search(query, { limit: 5 }).catch(() => []);
    if (search.length === 0) return cmd.err('No search results');

    const embed = new EmbedBuilder()
      .setTitle('Select music to play')
      .setColor(BotUtil.EmbedType.INFO);
    search.forEach((s, idx) => {
      embed.addField(
        `${idx + 1}\uFE0F\u20E3 ${escapeMarkdown(s.uploader.name ?? '???')}`,
        `[🔗](${s.url}) ${escapeMarkdown(s.name)}`
      );
    });

    const buttons = new ActionRowBuilder<ButtonBuilder>();
    for (let i = 1; i <= search.length; i++)
      buttons.addComponents(createButton(i));

    cmd.reply({ embeds: [embed], components: [buttons], ephemeral: true });
  },
};

function createButton(num: number) {
  return new ButtonBuilder().setCustomId(`search-select-${num}`).setLabel(num.toString()).setStyle(ButtonStyle.Primary);
}