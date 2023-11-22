const process = require('node:process')
const path = require('node:path')
const dotenv = require('dotenv')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const NYXB = require('@nyxb/commands')
const cj = require('consolji')
const settings = require('./settings.json')
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

  for (const role_id in settings.roles) {
    const class_name = settings.roles[role_id]
    createFolders(class_name)
  }

  initializeCronJobs(client)

  new NYXB(client, {
    commandsDir: path.join(__dirname, 'commands'),
  })

  cj.log('Scheduled Cron Job!')
})
