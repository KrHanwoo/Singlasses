import { ApplicationCommandManager, GuildApplicationCommandManager, Interaction, InteractionType, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';
import fs from 'fs';
import { Bot } from '../bot';
const { resolve } = require('path');
const { readdir } = require('fs').promises;

const map = new Map();

export class InteractionHandler {

  static async register(manager: ApplicationCommandManager | GuildApplicationCommandManager) {
    const files = (await getFiles('interactions')).filter((file) => file.endsWith('.js'));
    files.forEach(async f => {
      const interaction = require(f);
      const fn = interaction.execute;
      const data = interaction.data ?? null;
      if (data !== null) {
        manager.create(interaction.data);
        map.set(interaction.data.name, fn);
      } else {
        map.set(interaction.id, fn);
      }
    });

    Bot.client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.guild === null) return;
      switch (interaction.type) {
        case InteractionType.MessageComponent: {
          let id = (interaction as MessageComponentInteraction).customId;
          if (id.startsWith('search-select-')) id = 'search-select';
          const fn = map.get(id) ?? null;
          if (fn !== null) fn(interaction);
          return;
        }
        case InteractionType.ModalSubmit: {
          const fn = map.get((interaction as ModalSubmitInteraction).customId) ?? null;
          if (fn !== null) fn(interaction);
          return;
        }
        case InteractionType.ApplicationCommand: {
          const fn = map.get(interaction.commandName) ?? null;
          if (fn !== null) fn(interaction);
          return;
        }
        case InteractionType.ApplicationCommandAutocomplete: {
          const fn = map.get(`${interaction.commandName}+`) ?? null;
          if (fn !== null) fn(interaction);
          return;
        }
      }
    });

    console.log('Commands registerd');
  }
}


async function getFiles(dir: fs.PathLike) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent: any) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}