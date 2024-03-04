import { SlashCommandBuilder } from 'discord.js'
import DiscordDB from "../../libs/DiscordDB.js"
import configJson from '../../config.json' assert {type: 'json'}
import Craps from '../../libs/Craps.mjs';
const { adminId } = configJson

const reset = {
  data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset a player\'s bank.')
    .addStringOption(option =>
      option.setName('user_id')
        .setDescription('User ID.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('Bank amount.')
        .setRequired(true)),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    let content
    if (interaction.user.id !== adminId) {
      content = `Only admin can use this command.`
    } else {
      const userId = interaction.options.getString('user_id')
      if (DiscordDB.ddb.users.includes(userId)) {
        const amount = Number.parseInt(interaction.options.getString('amount'))
        DiscordDB.ddb.set(userId, amount)
        await DiscordDB.ddb.update()
        if (userId in Craps.players) Craps.players[userId].bank = amount
        content = `Reset user ${userId} bank to ${amount}.`
        // TODO - do we want to check if they are sitting at the table and also reset their CrapsPlayer bank?
        // TODO - should we announce the change to the whole channel?
      } else {
        content = `_Cannot find user ${userId} in db._`
      }
    }
    await interaction.reply({content, ephemeral: true})
  },
};

export { reset as default }
