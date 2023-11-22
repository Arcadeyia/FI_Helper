const dotenv = require('dotenv')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const cmd = require('./deploy_commands.js')
const settings = require('./settings.json')
const initializeCronJobs = require('./cronJobHandler.js')
const createFolders = require('./folderHandler.js')

dotenv.config({ path: 'cfg.env' })

const client = new Client({
  intents: new IntentsBitField(3276799),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent],
})

client.login(process.env.TOKEN)

cmd.registerCommands(client)

client.once(Events.ClientReady, async (_c) => {
  console.log('Bot Ready!')

  // Erstellen der Verzeichnisse für jede Klasse
  for (const role_id in settings.roles) {
    const class_name = settings.roles[role_id]
    createFolders(class_name)
  }

  // Initialisieren des ausgelagerten Cronjobs
  initializeCronJobs(client)
  console.log('Scheduled Cron Job!')
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand())
    return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction, client)
  }
  catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred)
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })

    else
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})
