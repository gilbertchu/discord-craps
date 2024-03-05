import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"
import DiscordDB from "../../libs/DiscordDB.js"

const rollDice = async function(user) {
  const { username } = user
  const lines = [];
  const outcomes = Craps.roll()
  const pointText = Craps.point === null ? 'Come out roll' : `Point is ${Craps.point}`
  lines.push(`**${username}** ROLLED \`[${outcomes.roll[0]}]\` \`[${outcomes.roll[1]}]\` ... (**${outcomes.sum}**) _ON: ${pointText}_ !!!`)
  if (outcomes.establishedPoint) lines.push(`_Established point: ${outcomes.sum}_`)
  if (outcomes.hitPoint) lines.push(`**Hit the point!**`)
  if (outcomes.sevenOut) lines.push(`Seven out.`)
  const formatBetOutcome = function([fullName, gain, note]) {
    if (gain === 0) return `_${fullName} moved to ${note}_`
    const change = gain > 0 ? 'WON' : 'LOST'
    return `${fullName} ${change} $${Math.abs(gain)}${note}`
  }
  for (const [playerId, playerOutcome] of Object.entries(outcomes.players)) {
    if (!playerOutcome.betOutcomes.length) continue
    await DiscordDB.ddb.setPlayerToAvailableMoney(Craps.players[playerId])
    lines.push(`> **${playerOutcome.name}**: ${playerOutcome.betOutcomes.map(v => `${formatBetOutcome(v)}`).join(' / ')}`)
  }
  return lines.join('\n')
}

const roll = {
  data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll the dice.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    await interaction.deferReply({ephemeral: true})
    if (!(interaction.user.id in Craps.players)) {
      await interaction.editReply(`_You must join the table to roll._`)
    } else if (Craps.rolling) {
      await interaction.editReply("_Someone is already rolling._")
    } else {
      Craps.isRolling = true
      await interaction.editReply('**Rolling!**')
      const res = {callback: () => Craps.isRolling = false}
      const message = await rollDice(interaction.user)
      if (message) res.message = message
      return res
    }
  },
};

export { roll as default }
