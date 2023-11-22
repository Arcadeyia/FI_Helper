const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs")
const https = require("https")
const settings = require("../../settings.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('Upload Report or Schedule.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('report')
                .setDescription('Upload Report for Class')
                .addAttachmentOption(option =>
                    option.setName('attachment')
                        .setDescription('The PDF to Upload')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('week')
                        .setDescription('The week of the Report/Schedule')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('The Year of the Report/Schedule')
                        .setRequired(true)
                ),)
        .addSubcommand(subcommand =>
            subcommand
                .setName('schedule')
                .setDescription('Upload Schedule for Class')
                .addAttachmentOption(option =>
                    option.setName('attachment')
                        .setDescription('The PDF to Upload')
                        .setRequired(true))

                .addIntegerOption(option =>
                    option.setName('week')
                        .setDescription('The week of the Report/Schedule')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('year')
                        .setDescription('The Year of the Report/Schedule')
                        .setRequired(true)
                        .setMinValue(2000)
                        .setMaxValue(2050)
                )),
    async execute(interaction, client) {
        const sub_command = interaction.options.getSubcommand()
        const attachment = interaction.options.getAttachment("attachment")
        const week = interaction.options.getInteger("week")
        const year = interaction.options.getInteger("year")

        for (var role_id in settings.roles) {
            if (interaction.member.roles.cache.has(role_id)) {
                channel_id = settings.channels[sub_command][role_id]
                class_name = settings.roles[role_id]
                break
            }
        }


        if (sub_command == "report") {
            for (var i = 1; i <= 10; i++) {
                path = `Report/${class_name}/KW${week}_${i}_${year}.pdf`
                if (!fs.existsSync(path)) {
                    break
                }
            }


        } else {
            for (var i = 1; i <= 10; i++) {
                path = `Schedule//${class_name}/KW${week}_${i}_${year}.pdf`

                if (!fs.existsSync(path)) {
                    break
                }
            }

        }
        const file = fs.createWriteStream(path);
        https.get(attachment.url, function (response) {
            response.pipe(file);
            file.on("finish", async () => {
                file.close();
                await interaction.reply({ content: 'File Uploaded!', ephemeral: true });
                client.channels.cache.get(channel_id).send({ content: `New ${sub_command} available for Week ${week}!`, files: [path] })
            });
        });
    }
};