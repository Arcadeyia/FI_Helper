const { SlashCommandBuilder } = require('discord.js')
const report = require('../../report.js')
const config = require('../../config.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reports')
    .setDescription('Receive Reports.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Get all available class reports'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('week')
        .setDescription('Get class report from a specific week')
        .addIntegerOption(option =>
          option.setName('kw')
            .setDescription('The week you want to receive')
            .setRequired(true))),
  async execute(interaction) {
    const subcmd = interaction.options.getSubcommand()
    let class_name

    Object.entries(config.classes).forEach(([className, classConfig]) => {
      if (interaction.member.roles.cache.has(classConfig.roleId))
        class_name = className
    })

    if (!class_name) {
      await interaction.reply({ content: `You do not have a role associated with any class.`, ephemeral: true })
      return
    }

    if (subcmd === 'all') {
      let counter = 0
      const report_packets = report.getAllReports(class_name)
      for (const packet of report_packets) {
        counter++
        interaction.user.send({ content: `All available Reports for ${class_name}! ${counter}/${report_packets.length}`, files: packet })
      }
    }
    else {
      const week = interaction.options.getInteger('kw')
      const report_files = report.getReportFromWeek(class_name, week)
      if (report_files)
        interaction.user.send({ content: `Reports for ${class_name} from week ${week}`, files: report_files })

      else
        interaction.user.send(`No available Reports for ${class_name} for week ${week}`)
    }

    await interaction.reply({ content: `Send a DM with the Files for ${class_name}!`, ephemeral: true })
  },
}
