import { SlashCommandBuilder } from 'discord.js'
import Craps from "../../libs/Craps.mjs"

const setting = {
  data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('Change a player setting.')
    .addStringOption(option =>
      option.setName('main_setting')
        .setDescription('Main setting.')
        .addChoices(
          { name: 'Auto move place/buy to come odds', value: 'autoMovePlaceBuyToComeOdds' },
          { name: 'Auto rebuy pass line on win', value: 'autoRebuyPassLine' },
          { name: 'Auto off on comeout (+sub_setting)', value: 'autoOffOnComeOut' },
        ))
    .addStringOption(option =>
      option.setName('sub_setting')
        .setDescription('Main setting option OR auto off sub setting.')
        .addChoices(
          { name: 'True', value: 'true' },
          { name: 'False', value: 'false' },
          { name: 'Hardways (as Auto off sub setting)', value: 'hardways' },
          { name: 'Come odds (as Auto off sub setting)', value: 'comeOdds' },
          { name: 'Place/buy (as Auto off sub setting)', value: 'placeBuy' },
          { name: 'All (as Auto off sub setting)', value: 'all' },
        ))
    .addStringOption(option =>
      option.setName('auto_off_option')
        .setDescription('Auto off option.')
        .addChoices(
          { name: 'True', value: 'true' },
          { name: 'False', value: 'false' },
        )),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    // await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    const mainSetting = interaction.options.getString('main_setting')
    const subSetting = interaction.options.getString('sub_setting')
    const tertSetting = interaction.options.getString('auto_off_option')
    const player = Craps.players[interaction.user.id]
    let content
    if (typeof player === 'undefined') {
      content = `Must have joined to view/change settings.`
    } else if (!mainSetting) {
      content = `Current settings:\n\`\`\`\nautoOffOnComeOut: ${JSON.stringify(player.autoOffOnComeOut, null, 2)}\nOther: ${JSON.stringify(player.settings, null, 2)}\n\`\`\``
    } else if (mainSetting === 'autoOffOnComeOut') {
      if (!['hardways', 'comeOdds', 'placeBuy', 'all'].includes(subSetting)) {
        content = `Invalid second parameter (${mainSetting} requires a subsetting - not true or false)!`
      } else if (!['true', 'false'].includes(tertSetting)) {
        content = `Invalid third parameter (${mainSetting} for ${subSetting} is true or false only)!`
      } else {
        const tertSettingOption = tertSetting === 'true' ? true : false
        if (subSetting === 'all') {
          for (const setting in player.autoOffOnComeOut) {
            player.autoOffOnComeOut[setting] = tertSettingOption
          }
        } else {
          player.autoOffOnComeOut[subSetting] = tertSettingOption
        }
        content = `Set autoOffOnComeOut for ${subSetting} to ${tertSetting}.`
      }
    } else {
      if (!['true', 'false'].includes(subSetting)) {
        content = `Invalid second parameter (${mainSetting} is true or false only)!`
      } else if (tertSetting) {
        content = `Invalid third parameter (${mainSetting} cannot have third parameter)!`
      } else {
        player.settings[mainSetting] = subSetting === 'true' ? true : false
        content = `Set ${mainSetting} to ${subSetting}.`
      }
    }
    await interaction.reply({content, ephemeral: true})
  },
};

export { setting as default }
