const dotenv = require('dotenv');
const fs = require("fs")
const cmd = require("./deploy_commands.js")
const schedule = require("./schedule.js")
const settings = require("./settings.json")
const cron = require("node-cron")

dotenv.config({ path: 'cfg.env' });

const { Client, Events, IntentsBitField, Partials } = require('discord.js');
const client = new Client({
    intents: new IntentsBitField(3276799),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent]
});
client.login(process.env.TOKEN);

cmd.registerCommands(client)

client.once(Events.ClientReady, async c => {
    console.log("Bot Ready!")

    for (const role_id in settings.roles) {
        const class_name = settings.roles[role_id]
        createFolders(class_name)
    }


    cron.schedule('0 * * * *', () => {
        console.log("Running Cron Job....")
        cur_week = getCurrentWeek()
        console.log("Downloading Schedule...")

        for (const role_id in settings.roles) {
            const class_name = settings.roles[role_id]
            schedule.downloadSchedules(class_name, cur_week, (path) => {
                client.channels.cache.get(settings.channels.schedule[role_id]).send({
                    content: `New Schedule Available!`,
                    files: [path]
                })
            })

        }

        console.log("Cron Job Finished!")
    });

    console.log("Scheduled Cron Job!")

});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        cons5ole.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error); 5
        if (interaction.replied || interaction.deferred) {
            await intera5ction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        } 5
    }
});

function getCurrentWeek() {
    currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);

    return weekNumber;
}

function createFolders(class_name) {
    const path_schedule = `Schedule/${class_name}`
    const path_report = `Report/${class_name}`
    if (!fs.existsSync(path_schedule)) {
        console.log(`Path for ${class_name} Schedules does not exist! Creating...`)
        fs.mkdirSync(path_schedule, { recursive: true });
    }

    if (!fs.existsSync(path_report)) {
        console.log(`Path for ${class_name} Reports does not exist! Creating...`)
        fs.mkdirSync(path_report, { recursive: true });
    }
}