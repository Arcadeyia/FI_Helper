const { CommandType } = require('@nyxb/commands')
const { ApplicationCommandOptionType } = require('discord.js')
const cj = require('consolji')
const schedule = require('../../schedulers/stundenplan.js')
const config = require('../../utils/config.js')

module.exports = {
  category: 'Schedule',
  description: 'Receive Schedules.',
  type: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'type',
      description: 'Type of schedule to fetch',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: 'All',
          value: 'all',
        },
        {
          name: 'Week',
          value: 'week',
        },
      ],
    },
    {
      name: 'week',
      description: 'The week number for the schedule',
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const type = interaction.options.getString('type')
    const week = interaction.options.getInteger('week')
    let klassenName

    cj.log('Benutzerrollen-IDs:', interaction.member.roles.cache.map(role => role.id))
    cj.log('Konfigurierte Klassenrollen-IDs:', Object.values(config.classes).map(c => c.roleId))

    Object.entries(config.classes).forEach(([zugewieseneKlasse, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId))
        klassenName = zugewieseneKlasse
    })

    cj.log('Gefundener Klassenname:', klassenName)

    if (!klassenName)
      return `Du hast keine Rolle die mit deiner Klasse verbunden ist. Bitte wende dich an einen Orga.`

    if (type === 'all') {
      const schedule_packets = schedule.getAllSchedules(klassenName)
      schedule_packets.forEach((packet, index) => {
        interaction.user.send({ content: `Alle verfügbaren Stundenpläne für ${klassenName}! ${index + 1}/${schedule_packets.length}`, files: packet })
      })
      return `Versenden eines DM mit allen Stundenplänen für ${klassenName}!`
    }
    else if (type === 'week') {
      if (!week)
        return `Bitte gib eine Wochenzahl an.`

      const schedule_files = schedule.getScheduleFromWeek(klassenName, week)
      if (schedule_files) {
        interaction.user.send({ content: `Stundenpläne für ${klassenName} ab Woche ${week}`, files: schedule_files })
        return `Versenden einer DM mit Stundenplänen für ${klassenName} für Woche ${week}.`
      }
      else {
        return `Keine verfügbaren Stundenpläne für ${klassenName} für Woche ${week}`
      }
    }
  },
}
