const fs = require('node:fs')
const https = require('node:https')
const { CommandType } = require('@nyxb/commands')
const config = require('../../config.js')

module.exports = {
  category: 'Upload', // Kategorie des Befehls
  description: 'Upload Report or Schedule', // Beschreibung des Befehls

  slash: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'type',
      description: 'Choose the type of upload',
      type: 'STRING',
      required: true,
      choices: [
        {
          name: 'Report',
          value: 'report',
        },
        {
          name: 'Schedule',
          value: 'schedule',
        },
      ],
    },
    {
      name: 'attachment',
      description: 'The PDF to Upload',
      type: 'ATTACHMENT',
      required: true,
    },
    {
      name: 'week',
      description: 'The week of the Report/Schedule',
      type: 'INTEGER',
      required: true,
    },
    {
      name: 'year',
      description: 'The Year of the Report/Schedule',
      type: 'INTEGER',
      required: true,
      minValue: 2000,
      maxValue: 2050,
    },
  ],

  callback: async ({ interaction, client }) => {
    const type = interaction.options.getString('type')
    const attachment = interaction.options.getAttachment('attachment')
    const week = interaction.options.getInteger('week')
    const year = interaction.options.getInteger('year')

    let channelId, className

    Object.entries(config.classes).forEach(([classNameValue, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId)) {
        channelId = classConfig[type === 'report' ? 'berichtsheftChannelId' : 'stundenplanChannelId']
        className = classNameValue
      }
    })

    if (!className || !channelId)
      return 'You do not have a role associated with any class or channel.'

    let filePath
    for (let i = 1; i <= 10; i++) {
      filePath = `${type === 'report' ? 'Report' : 'Schedule'}/${className}/KW${week}_${i}_${year}.pdf`
      if (!fs.existsSync(filePath))
        break
    }

    const file = fs.createWriteStream(filePath)
    https.get(attachment.url, (response) => {
      response.pipe(file)
      file.on('finish', async () => {
        file.close()
        await interaction.reply({ content: 'File Uploaded!', ephemeral: true })
        client.channels.cache.get(channelId).send({ content: `New ${type} available for Week ${week}!`, files: [filePath] })
      })
    })
  },
}
