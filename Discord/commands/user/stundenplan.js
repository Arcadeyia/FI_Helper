const { CommandType } = require('@nyxb/commands')
const { ApplicationCommandOptionType } = require('discord.js')
const cj = require('consolji')
const schedule = require('../../schedulers/stundenplan.js')
const config = require('../../utils/config.js')

module.exports = {
  category: 'Information',
  description: 'Stundenpläne erhalten.',
  type: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'typ',
      description: 'Typ des abzurufenden Stundenplans',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: 'Alle',
          value: 'alle',
        },
        {
          name: 'Woche',
          value: 'woche',
        },
      ],
    },
    {
      name: 'woche',
      description: 'Die Wochennummer für den Stundenplan',
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const typ = interaction.options.getString('typ')
    const woche = interaction.options.getInteger('woche')
    let klassenName

    cj.log('Benutzerrollen-IDs:', interaction.member.roles.cache.map(role => role.id))
    cj.log('Konfigurierte Klassenrollen-IDs:', Object.values(config.klassen).map(c => c.roleId))

    Object.entries(config.klassen).forEach(([zugewieseneKlasse, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId))
        klassenName = zugewieseneKlasse
    })

    cj.log('Gefundener Klassenname:', klassenName)

    if (!klassenName)
      return `Du hast keine Rolle die mit deiner Klasse verbunden ist. Bitte wende dich an einen Orga.`

    if (typ === 'alle') {
      const schedule_packets = schedule.getAllSchedules(klassenName)
      schedule_packets.forEach((packet, index) => {
        interaction.user.send({ content: `Alle verfügbaren Stundenpläne für ${klassenName}! ${index + 1}/${schedule_packets.length}`, files: packet })
      })
      return `Versenden eines DM mit allen Stundenplänen für ${klassenName}!`
    }
    else if (typ === 'woche') {
      if (!woche)
        return `Bitte gib eine Wochenzahl an.`

      const schedule_files = schedule.getScheduleFromWeek(klassenName, woche)
      if (schedule_files) {
        interaction.user.send({ content: `Stundenpläne für ${klassenName} ab Woche ${woche}`, files: schedule_files })
        return `Versenden einer DM mit Stundenplänen für ${klassenName} für Woche ${woche}.`
      }
      else {
        return `Keine verfügbaren Stundenpläne für ${klassenName} für Woche ${woche}`
      }
    }
  },
}
