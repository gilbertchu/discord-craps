import { SlashCommandBuilder } from 'discord.js'
import CrapsPlayer from "../../libs/CrapsPlayer.mjs"

const commands = '> Commands available:\n> - `/join`\n> - `/leave`\n> - `/bet <name> <amount>`\n> - `/roll`\n' +
                 '> - `/status`\n> - `/summary`\n> - `/setting <name> <option>`\n> - `/help <optional_category>`\n' +
                 '> Help categories available: `commands`, `bets`, `aliases`, `settings`'
const bets = '> Bets available: ' + CrapsPlayer.allBets.map(v => '`'+v+'`').join(', ')
const aliases = '> Bet aliases: \n' + CrapsPlayer.formattedAliases
const settings = '> Settings available:\n> - `/setting <autoMovePlaceBuyToComeOdds|autoRebuyPassLine> <true|false>`\n' +
                 '> - `/setting autoOffOnComeout <hardways|comeOdds|placeBuy|all> <true|false>`\n' +
                 '> - `/setting` (view current settings)'

const categories = {commands, bets, aliases, settings}

const help = {
  data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get a list of commands.')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Help on specific category.')
        .addChoices(
          { name: 'Commands', value: 'commands' },
          { name: 'Bets', value: 'bets' },
          { name: 'Bet aliases', value: 'aliases' },
          { name: 'Settings', value: 'settings' },
        )),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    const category = interaction.options.getString('category') ?? 'commands'
    const content = categories[category]
    await interaction.reply({content, ephemeral: true})
  },
};

export { help as default }
