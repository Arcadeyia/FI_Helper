const { CommandType } = require('@nyxb/commands')
const schedule = require('../../schedulers/schedule.js')
const config = require('../../config.js')

module.exports = {
  category: 'Schedule', // Kategorie des Befehls
  description: 'Receive Schedules.', // Beschreibung des Befehls

  slash: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'type',
      description: 'Type of schedule to fetch',
      type: 'STRING',
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
      type: 'INTEGER',
      required: false,
    },
  ],

  callback: async ({ interaction }) => {
    const type = interaction.options.getString('type')
    const week = interaction.options.getInteger('week')
    let class_name

    Object.entries(config.classes).forEach(([className, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId))
        class_name = className
    })

    if (!class_name)
      return `You do not have a role associated with any class.`

    if (type === 'all') {
      const schedule_packets = schedule.getAllSchedules(class_name)
      schedule_packets.forEach((packet, index) => {
        interaction.user.send({ content: `All available Schedules for ${class_name}! ${index + 1}/${schedule_packets.length}`, files: packet })
      })
      return `Sending a DM with all Schedules for ${class_name}!`
    }
    else if (type === 'week') {
      if (!week)
        return `Please provide a week number.`

      const schedule_files = schedule.getScheduleFromWeek(class_name, week)
      if (schedule_files) {
        interaction.user.send({ content: `Schedules for ${class_name} from week ${week}`, files: schedule_files })
        return `Sending a DM with Schedules for ${class_name} for week ${week}.`
      }
      else {
        return `No available Schedules for ${class_name} for week ${week}`
      }
    }
  },
}
