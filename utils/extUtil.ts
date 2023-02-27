import { BaseInteraction, EmbedBuilder, Guild, User } from "discord.js";
import { BotUtil } from "./util";

declare module 'discord.js' {
  interface EmbedBuilder {
    addField(key: string, value: string | null | undefined, inline?: boolean): EmbedBuilder;
    setUser(author: User, showTag?: boolean): EmbedBuilder;
    setGuild(guild: Guild): EmbedBuilder;
  }

  interface BaseInteraction {
    err(message: string, ephemeral?: boolean): Promise<InteractionResponse<boolean> | undefined>;
    success(message: string, ephemeral?: boolean): Promise<InteractionResponse<boolean> | undefined>;
    info(message: string, ephemeral?: boolean): Promise<InteractionResponse<boolean> | undefined>;
  }
}

export class ExtUtil {
  static initialize() {
    EmbedBuilder.prototype.setUser = function (author: User, showTag: boolean = true): EmbedBuilder {
      return this.setAuthor({
        name: showTag ? author.tag : author.username, iconURL: author.displayAvatarURL()
      });
    }

    EmbedBuilder.prototype.setGuild = function (guild: Guild): EmbedBuilder {
      return this.setAuthor({
        name: guild.name, iconURL: guild.iconURL() ?? undefined
      });
    }

    EmbedBuilder.prototype.addField = function (name: string, value: string | null | undefined, inline: boolean = false): EmbedBuilder {
      if (!value || String(value).length <= 0) return this;
      return this.addFields({ name: name, value: value, inline: inline });
    }

    BaseInteraction.prototype.err = async function (message: string, ephemeral: boolean = true) {
      if (!this.isRepliable()) return;
      return this.reply({
        embeds: [BotUtil.embed(message, BotUtil.EmbedType.FAIL)],
        ephemeral: ephemeral
      }).catch(() => undefined);
    }

    BaseInteraction.prototype.success = async function (message: string, ephemeral: boolean = true) {
      if (!this.isRepliable()) return;
      return this.reply({
        embeds: [BotUtil.embed(message, BotUtil.EmbedType.SUCCESS)],
        ephemeral: ephemeral
      }).catch(() => undefined);
    }

    BaseInteraction.prototype.info = async function (message: string, ephemeral: boolean = true) {
      if (!this.isRepliable()) return;
      return this.reply({
        embeds: [BotUtil.embed(message, BotUtil.EmbedType.INFO)],
        ephemeral: ephemeral
      }).catch(() => undefined);
    }
  }
}

