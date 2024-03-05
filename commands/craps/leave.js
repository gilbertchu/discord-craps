import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"
import DiscordDB from "../../libs/DiscordDB.js"

const leaveTable = async function(user) {
  const { id, username } = user
  Craps.players[id].removeAllBets()
  await DiscordDB.ddb.setPlayerToAvailableMoney(Craps.players[id])
  delete Craps.players[id]
  console.log('Player left:', username)
  return true
}

const leave = {
  data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the table.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    const atTable = interaction.user.id in Craps.players
    const content = atTable ? 'Leaving table...' : '_Already haven\'t joined the table._'
    await interaction.reply({content, ephemeral: true})
    if (atTable) {
      const res = await leaveTable(interaction.user)
      if (res) return `**${interaction.user.username}** left the table.`
    }
  },
};

export { leave as default }
