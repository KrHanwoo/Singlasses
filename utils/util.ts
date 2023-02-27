import { EmbedBuilder, escapeMarkdown } from 'discord.js';
import { Queue, Song } from 'distube';

enum EmbedType {
  SUCCESS = 0x3c95ff,
  FAIL = 0xff5c5c,
  INFO = 0x676767,
  PLAY = 0xc6ff9e,
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BotUtil {
  static EmbedType = EmbedType;

  static embed(msg: string, type: EmbedType = EmbedType.FAIL) {
    return new EmbedBuilder().setColor(type).setDescription(msg);
  }

  static createEmbed(song: Song, queue: Queue) {
    try {
      return new EmbedBuilder()
        .setTitle(escapeMarkdown(song.uploader.name!))
        .setDescription(`[🔗](${song.url}) ${escapeMarkdown(song.name!)}`)
        .addField('Duration', song.formattedDuration, true)
        .addField('Queue', `#${queue.songs.length}`, true)
        .addField('Requester', song.member?.toString(), true)
        .setColor(BotUtil.EmbedType.PLAY)
        .setThumbnail(song.thumbnail!);
    } catch (e) {
      return this.embed('Failed to get video info');
    }
  }
}