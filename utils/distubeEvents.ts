import { RepliableInteraction } from "discord.js";
import { Bot } from "../bot";
import { BotUtil } from "./util";

export class DistubeEvents {
  static initialize() {
    Bot.distube.on('addSong', (queue, song) => {
      const cmd = song.metadata as RepliableInteraction;
      cmd.editReply({ embeds: [BotUtil.createEmbed(song, queue)] });
    });
  }
}