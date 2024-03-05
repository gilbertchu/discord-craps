import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"

const getSummary = function(user) {
  const { id, username } = user
  if (!(id in Craps.players)) return `You have not joined the table.`
  const player = Craps.players[id]
  return player.summary()
}

const summary = {
  data: new SlashCommandBuilder()
		.setName('summary')
		.setDescription('Get a summary for the player.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    const content = getSummary(interaction.user)
    await interaction.reply({content, ephemeral: true})
  },
};

export { summary as default }
