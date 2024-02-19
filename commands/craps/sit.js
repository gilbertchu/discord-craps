import { SlashCommandBuilder } from 'discord.js'
import CrapsPlayer from "../../libs/CrapsPlayer.mjs"
import Craps from "../../libs/Craps.mjs"
import DiscordDB from "../../libs/DiscordDB.js"

const startingBank = 200

const addPlayer = async function(user) {
  const { id, username } = user
  if (id in Craps.players) return false
  const bank = DiscordDB.ddb.has(id) ? DiscordDB.ddb.get(id) : startingBank
  const player = new CrapsPlayer(username, id, bank)
  console.log('New player:', username, bank)
  if (!DiscordDB.ddb.has(id)) await DiscordDB.ddb.setPlayerToAvailableMoney(player)
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
    const res = await addPlayer(interaction.user)
    const reply = res ? `Joined the table! (chips: **$${res.bank})**` : 'Already sitting at the table!'
    await interaction.editReply(reply)
    if (res) return `**${interaction.user.username}** joined the table (chips: **$${res.bank}**)!`
  },
};

export { sit as default }
