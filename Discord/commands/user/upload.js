const fs = require('node:fs')
const https = require('node:https')
const { CommandType } = require('@nyxb/commands')
const { ApplicationCommandOptionType } = require('discord.js')
const config = require('../../utils/config.js')

module.exports = {
  category: 'Upload',
  description: 'Bericht oder Stundenplan hochladen',
  type: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'typ',
      description: 'Wähle die Art des Uploads',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: 'Bericht',
          value: 'bericht',
        },
        {
          name: 'Stundenplan',
          value: 'stundenplan',
        },
      ],
    },
    {
      name: 'anhang',
      description: 'Die hochzuladende PDF',
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
    {
      name: 'week',
      description: 'Die Woche des Berichts/Stundenplans',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'year',
      description: 'Das Jahr des Berichts/Stundenplans',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 2000,
      maxValue: 2050,
    },
  ],

  callback: async ({ interaction, client }) => {
    const typ = interaction.options.getString('typ')
    const anhang = interaction.options.getAttachment('anhang')
    const week = interaction.options.getInteger('week')
    const year = interaction.options.getInteger('year')

    let channelId, klassenName

    Object.entries(config.klassen).forEach(([klasse, klassenConfig]) => {
      if (interaction.member.roles.cache.has(klassenConfig.rollenId)) {
        channelId = klassenConfig[typ === 'bericht' ? 'berichtsheftChannelId' : 'stundenplanChannelId']
        klassenName = klasse
      }
    })

    if (!klassenName || !channelId)
      return 'Du hast keine Rolle, die mit einer Klasse oder einem Kanal verbunden ist.'

    let filePath
    for (let i = 1; i <= 10; i++) {
      filePath = `${typ === 'bericht' ? 'Bericht' : 'Stundenplan'}/${klassenName}/KW${week}_${i}_${year}.pdf`
      if (!fs.existsSync(filePath))
        break
    }

    const file = fs.createWriteStream(filePath)
    https.get(anhang.url, (response) => {
      response.pipe(file)
      file.on('finish', async () => {
        file.close()
        await interaction.reply({ content: 'File Uploaded!', ephemeral: true })
        client.channels.cache.get(channelId).send({ content: `New ${typ} available for Week ${week}!`, files: [filePath] })
      })
    })
  },
}
