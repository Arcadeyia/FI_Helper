const process = require('node:process')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const dotenv = require('dotenv')
const initialisierung = require('../functions/initialisierung.js')

dotenv.config({ path: 'cfg.env' })

const client = new Client({
  intents: new IntentsBitField(3276799),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent],
})
client.login(process.env.TOKEN)

client.once(Events.ClientReady, async (c) => {
  console.log(`${c.user.username} Bereit!`)
  console.log(`${c.user.username} Starte Initialisierung...!`)
  initialisierung(c)
})
