const { SlashCommandBuilder } = require('discord.js');
const schedule = require("../../schedule.js")
const settings = require("../../settings.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Receive Schedules.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Get all available class schedules')
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

        for (const role_id in settings.roles) {
            if (interaction.member.roles.cache.has(role_id)) {
                class_name = settings.roles[role_id]
                break
            }
        }

        if (subcmd == "all") {
            var counter = 0
            schedule_packets = schedule.getAllSchedules(class_name)
            for (const packet of schedule_packets) {
                counter++
                interaction.user.send({ content: `All available Schedules for ${class_name}! ${counter}/${schedule_packets.length}`, files: packet })
            }
        } else {
            const week = interaction.options.getInteger("kw")
            schedule_files = schedule.getScheduleFromWeek(class_name, week)
            if (schedule_files) {
                interaction.user.send({ content: `Schedules for ${class_name} from week ${week}`, files: schedule_files })
            } else {
                interaction.user.send(`No available Schedule for ${class_name} for week ${week}`)

            }
        }
        await interaction.reply({ content: `Send a DM with the Files for ${class_name}!`, ephemeral: true });
    },
};