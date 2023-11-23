const { CommandType } = require('@nyxb/commands')
const { ApplicationCommandOptionType } = require('discord.js')
const report = require('../../utils/report.js')
const config = require('../../utils/config.js')

module.exports = {
  category: 'Information',
  description: 'Berichte erhalten.',
  type: CommandType.BOTH,

  options: [
    {
      name: 'alle',
      description: 'Alle verfügbaren Klassenberichte abrufen',
      type: ApplicationCommandOptionType.Subcommand, // Stellen Sie sicher, dass dies korrekt ist
    },
    {
      name: 'woche',
      description: 'Klassenbericht für eine bestimmte Woche abrufen',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'kw',
          description: 'Die Woche, die du erhalten möchtest',
          type: ApplicationCommandOptionType.Integer, // Stellen Sie sicher, dass dies korrekt ist
          required: true,
        },
      ],
    },
  ],

  callback: ({ interaction, args }) => {
    let klassenName = ''

    // Logik zur Bestimmung des klassenName basierend auf Rollen
    Object.entries(config.classes).forEach(([_, klassenConfig]) => {
      if (interaction.member.roles.cache.has(klassenConfig.rollenId))
        klassenName = klassenConfig.klassenName
    })

    if (!klassenName)
      return interaction.reply({ content: `Du hast keine Rolle, die mit einer Klasse verbunden ist.`, ephemeral: true })

    const type = args.find(arg => arg.name === 'type').value
    const woche = args.find(arg => arg.name === 'woche')?.value

    if (type === 'alle') {
      const report_packets = report.getAllReports(klassenName)
      report_packets.forEach((packet, index) => {
        interaction.user.send({ content: `Alle verfügbaren Berichte für ${klassenName}! ${index + 1}/${report_packets.length}`, files: packet })
      })
      return `Versenden einer DM mit allen Berichten für ${klassenName}!`
    }
    else if (type === 'woche' && woche !== undefined) {
      const report_files = report.getReportFromWeek(klassenName, woche)
      if (report_files) {
        interaction.user.send({ content: `Berichte für ${klassenName} von Woche ${woche}`, files: report_files })
        return `Senden einer DM mit Berichten für ${klassenName} für Woche ${woche}.`
      }
      else {
        return `Keine verfügbaren Berichte für ${klassenName} für Woche ${woche}`
      }
    }
  },
}
