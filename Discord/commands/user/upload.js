const fs = require('node:fs')
const https = require('node:https')
const { SlashCommandBuilder } = require('discord.js')
const config = require('../../config.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload Report or Schedule.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('report')
        .setDescription('Upload Report for Class')
        .addAttachmentOption(option =>
          option.setName('attachment')
            .setDescription('The PDF to Upload')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('week')
            .setDescription('The week of the Report/Schedule')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('year')
            .setDescription('The Year of the Report/Schedule')
            .setRequired(true)),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('schedule')
        .setDescription('Upload Schedule for Class')
        .addAttachmentOption(option =>
          option.setName('attachment')
            .setDescription('The PDF to Upload')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('week')
            .setDescription('The week of the Report/Schedule')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('year')
            .setDescription('The Year of the Report/Schedule')
            .setRequired(true)
            .setMinValue(2000)
            .setMaxValue(2050),
        ),
    ),

  async execute(interaction, client) {
    const sub_command = interaction.options.getSubcommand()
    const attachment = interaction.options.getAttachment('attachment')
    const week = interaction.options.getInteger('week')
    const year = interaction.options.getInteger('year')

    let channelId, className

    Object.entries(config.classes).forEach(([classNameValue, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId)) {
        channelId = classConfig[sub_command === 'report' ? 'berichtsheftChannelId' : 'stundenplanChannelId']
        className = classNameValue
      }
    })

    if (!className || !channelId) {
      await interaction.reply({ content: 'You do not have a role associated with any class or channel.', ephemeral: true })
      return
    }

    let path
    if (sub_command === 'report') {
      for (let i = 1; i <= 10; i++) {
        path = `Report/${className}/KW${week}_${i}_${year}.pdf`
        if (!fs.existsSync(path))
          break
      }
    }
    else {
      for (let i = 1; i <= 10; i++) {
        path = `Schedule/${className}/KW${week}_${i}_${year}.pdf`
        if (!fs.existsSync(path))
          break
      }
    }

    const file = fs.createWriteStream(path)
    https.get(attachment.url, (response) => {
      response.pipe(file)
      file.on('finish', async () => {
        file.close()
        await interaction.reply({ content: 'File Uploaded!', ephemeral: true })
        client.channels.cache.get(channelId).send({ content: `New ${sub_command} available for Week ${week}!`, files: [path] })
      })
    })
  },
}
