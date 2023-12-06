// Hinzufügen diverser Module
const process = require('node:process')
const { Client, Events, IntentsBitField, Partials } = require('discord.js')
const dotenv = require('dotenv')
const initialisierung = require('../functions/initialisierung.js')

// Variable zum pfad der.env anhand von Environment Variable
const pfad = process.env.NODE_ENV === 'production' ? `${process.cwd()}/Javascript/config/production` : `${process.cwd()}/Javascript/config/testing`

// Setzen des Pfades der .env
dotenv.config({ path: `${pfad}/${process.env.NODE_ENV}.env` })
// Setzen der cfg
const cfg = require(`${pfad}/${process.env.NODE_ENV}.json`)

// Erstellung des Bot Clienten
const client = new Client({
  intents: new IntentsBitField(3276799),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.GuildScheduledEvent],
})

// Starten des Bot Clienten
client.login(process.env.TOKEN)

// Wenn der Bot bereits ist führe initialisierung aus
client.once(Events.ClientReady, async (c) => {
  console.log(`${c.user.username} Bereit!`)
  console.log(`${c.user.username} Starte Initialisierung...!`)
  initialisierung(c, cfg)
  console.log(`${c.user.username} Initialisierung Beendet!`)
})
