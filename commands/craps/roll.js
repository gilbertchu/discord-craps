import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"
import DiscordDB from "../../libs/DiscordDB.js"

const rollDice = async function(user) {
  const { id, username } = user
  if (!(id in Craps.players)) return [`You must be sitting at the table to roll.`, null]
  const outcomes = Craps.roll()
  const lines = [];
  lines.push(`**${username}** ROLLED \`[${outcomes.roll[0]}]\` \`[${outcomes.roll[1]}]\` ... (_${outcomes.sum}_) !!!`)
  if (outcomes.establishedPoint) lines.push(`_Established point: ${outcomes.sum}_`)
  if (outcomes.hitPoint) lines.push(`**Hit the point!**`)
  if (outcomes.sevenOut) lines.push(`Seven out.`)
  const formatBetOutcome = function([fullName, gain, note]) {
    const change = gain > 0 ? 'WON' : 'LOST'
    return `${fullName} ${change} $${Math.abs(gain)}${note}`
  }
  for (const [playerId, playerOutcome] of Object.entries(outcomes.players)) {
    if (!playerOutcome.betOutcomes.length) continue
    await DiscordDB.ddb.setPlayerToAvailableMoney(Craps.players[playerId])
    lines.push(`> **${playerOutcome.name}**: ${playerOutcome.betOutcomes.map(v => `${formatBetOutcome(v)}`).join(' / ')}`)
  }
  return ['**Rolling!**', lines.join('\n')]
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
    if (Craps.rolling) {
      await interaction.editReply("_Someone is already rolling._")
    } else {
      Craps.rolling = true
      const [res, outcome] = await rollDice(interaction.user)
      await interaction.editReply(res)
      Craps.rolling = false
      if (outcome) return outcome
    }
  },
};

export { roll as default }
