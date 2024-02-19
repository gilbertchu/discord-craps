import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"
import DiscordDB from "../../libs/DiscordDB.js"

const playerBet = function(user, type, amount) {
  const { id, username } = user
  if (!(id in Craps.players)) return `You are not sitting at the table!`
  const player = Craps.players[id]
  return player.bet(type, amount)
}

const bet = {
  data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Place a bet.')
    .addStringOption(option => option.setName('type').setDescription('Type of bet (name).').setRequired(true))
    .addStringOption(option => option.setName('amount').setDescription('Amount to bet.').setRequired(true)),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    await interaction.deferReply({ephemeral: true})
    const type = interaction.options.getString('type')
    const amount = interaction.options.getString('amount')
    const res = playerBet(interaction.user, type, amount)
    let msg
    if (Array.isArray(res)) {
      const [formattedType, cleared, ...withVig] = res
      if (cleared) {
        await interaction.editReply(`Removed bet ${formattedType} $${cleared}.`)
        // await interaction.followUp(`${interaction.user.username} REMOVED BET ${formattedType} ${cleared}`)
        msg = `**${interaction.user.username}** REMOVED BET ${formattedType} $${cleared}`
      } else if (withVig.length) {
        const [actualBet, vig] = withVig
        await interaction.editReply(`Placed bet ${formattedType} $${actualBet} (vig $${vig}).`)
        msg = `**${interaction.user.username}** BET ${formattedType} $${actualBet} (vig $${vig})`
      } else {
        await interaction.editReply(`Placed bet $${formattedType} $${amount}.`)
        // await interaction.followUp(`${interaction.user.username} BET ${formattedType} ${amount}`)
        msg = `**${interaction.user.username}** BET ${formattedType} $${amount}`
      }
      await DiscordDB.ddb.setPlayerToAvailableMoney(Craps.players[interaction.user.id])
    } else {
      await interaction.editReply(res)
    }
    return msg
  },
};

export { bet as default }
