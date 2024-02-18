import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"

const rollDice = function(user) {
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
    return `${fullName} ${change} ${Math.abs(gain)}${note}`
  }
  for (const playerOutcome of Object.values(outcomes.players)) {
    if (!playerOutcome.betOutcomes.length) continue
    lines.push(`> **${playerOutcome.name}**: ${playerOutcome.betOutcomes.reduce((a,v) => `${a} // ${formatBetOutcome(v)}`, '')}`)
  }
  return ['Rolling!', lines.join('\n')]
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
    const [res, outcome] = rollDice(interaction.user)
    await interaction.editReply(res)
    if (outcome) return outcome
  },
};

export { roll as default }
