const process = require('node:process')
const path = require('node:path')
const dotenv = require('dotenv')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const NYXB = require('@nyxb/commands')
const cj = require('consolji')
const config = require('./config.js') // Importieren der neuen Konfigurationsdatei
const initializeCronJobs = require('./cronJobHandler.js')
const createFolders = require('./folderHandler.js')

dotenv.config({ path: 'cfg.env' })

const client = new Client({
  intents: new IntentsBitField(3276799),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent],
})

client.login(process.env.TOKEN)

client.once(Events.ClientReady, () => {
  cj.log('🤖 Beep Boop i\'m Ready!')

  // Hier iterieren wir jetzt durch die Klassen in der config.js
  Object.entries(config.classes).forEach(([_, classConfig]) => {
    const class_name = classConfig.roleId
    createFolders(class_name)
  })

  initializeCronJobs(client)

  new NYXB(client, {
    commandsDir: path.join(__dirname, 'commands'),
    testServers: [config.testServerId],
  })

  cj.log('Scheduled Cron Job!')
})
