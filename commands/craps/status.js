import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"

const status = {
  data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get current game status.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    const content = Craps.status
    await interaction.reply({content, ephemeral: true})
  },
};

export { status as default }
