const { SlashCommandBuilder } = require('discord.js')
const schedule = require('../../schedulers/schedule.js')
const config = require('../../config.js') // Import der neuen Konfiguration

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Receive Schedules.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Get all available class schedules'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('week')
        .setDescription('Get class schedules from a specific week')
        .addIntegerOption(option =>
          option.setName('kw')
            .setDescription('The week you want to receive')
            .setRequired(true))),
  async execute(interaction) {
    const subcmd = interaction.options.getSubcommand()
    let class_name

    // Finden der entsprechenden Klasse basierend auf der Rolle des Benutzers
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
      const schedule_packets = schedule.getAllSchedules(class_name)
      for (const packet of schedule_packets) {
        counter++
        interaction.user.send({ content: `All available Schedules for ${class_name}! ${counter}/${schedule_packets.length}`, files: packet })
      }
    }
    else {
      const week = interaction.options.getInteger('kw')
      const schedule_files = schedule.getScheduleFromWeek(class_name, week)
      if (schedule_files)
        interaction.user.send({ content: `Schedules for ${class_name} from week ${week}`, files: schedule_files })

      else
        interaction.user.send(`No available Schedule for ${class_name} for week ${week}`)
    }

    await interaction.reply({ content: `Send a DM with the Files for ${class_name}!`, ephemeral: true })
  },
}
