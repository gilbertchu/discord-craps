import { SlashCommandBuilder } from 'discord.js'
import CrapsPlayer from "../../libs/CrapsPlayer.mjs"
import Craps from "../../libs/Craps.mjs"

const addPlayer = function(user) {
  const { id, username } = user
  if (id in Craps.players) return false
  const player = new CrapsPlayer(username, id, 200)
  Craps.addPlayer(id, player)
  return player
}

const sit = {
  data: new SlashCommandBuilder()
		.setName('sit')
		.setDescription('Sit at the table.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    await interaction.deferReply({ephemeral: true})
    const res = addPlayer(interaction.user)
    const reply = res ? `Joined the table! (chips: ${res.bank})` : 'Already sitting at the table!'
    await interaction.editReply(reply)
    if (res) return `**${interaction.user.username}** joined the table!`
  },
};

export { sit as default }
