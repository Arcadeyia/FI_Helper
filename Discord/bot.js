const process = require('node:process')
const path = require('node:path')
const dotenv = require('dotenv')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const NYXB = require('@nyxb/commands')

const { DefaultCommands } = NYXB
const cj = require('consolji')
const config = require('./utils/config.js')
const initializeCronJobs = require('./handler/cronJobHandler.js')
const createFolders = require('./handler/folderHandler.js')

dotenv.config({ path: 'cfg.env' })

const client = new Client({
  intents: new IntentsBitField(3276799),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent],
})

client.once(Events.ClientReady, async () => {
  cj.log('🤖 Beep Boop i\'m Ready!')

  try {
    for (const klassenName of Object.keys(config.klassen))
      await createFolders(klassenName)
  }
  catch (error) {
    console.error('Error creating folders:', error)
  }

  initializeCronJobs(client)

  new NYXB({
    client,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: [config.testServerId],
    disabledDefaultCommands: [
      DefaultCommands.ChannelCommand,
      DefaultCommands.CustomCommand,
      DefaultCommands.Prefix,
      DefaultCommands.RequiredPermissions,
      DefaultCommands.RequiredRoles,
      DefaultCommands.ToggleCommand,
    ],
  })

  cj.log('Starte Stundenplan Cron Job! 📅')
})

client.login(
  process.env.PROD === 'true'
    ? process.env.PROD_DISCORD_TOKEN
    : process.env.DEV_DISCORD_TOKEN,
)
