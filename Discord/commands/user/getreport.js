const { CommandType } = require('@nyxb/commands')
const report = require('../../report.js')
const config = require('../../config.js')

module.exports = {
  category: 'Information',
  description: 'Receive Reports.',

  slash: CommandType.BOTH,
  testOnly: true,
  guildOnly: true,

  options: [
    {
      name: 'type',
      description: 'Type of report to fetch',
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
      description: 'The week number for the report',
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
      const report_packets = report.getAllReports(class_name)
      report_packets.forEach((packet, index) => {
        interaction.user.send({ content: `All available Reports for ${class_name}! ${index + 1}/${report_packets.length}`, files: packet })
      })
      return `Sending a DM with all Reports for ${class_name}!`
    }
    else if (type === 'week') {
      if (!week)
        return `Please provide a week number.`

      const report_files = report.getReportFromWeek(class_name, week)
      if (report_files) {
        interaction.user.send({ content: `Reports for ${class_name} from week ${week}`, files: report_files })
        return `Sending a DM with Reports for ${class_name} for week ${week}.`
      }
      else {
        return `No available Reports for ${class_name} for week ${week}`
      }
    }
  },
}
