const fs = require('node:fs')
const process = require('node:process')
const ordner = require('../functions/erstelleordner')
const cronjob = require('../cronjob/stundenplan.js')
const Klassenzimmer = require('../klassenzimmer.js')
const deploycmd = require('../bot/deploy_commands.js')

// Führt diverse Initialisierungen aus
function initialisierung(client, cfg) {
  const klassenliste = erstelleKlassenzimmer(client, cfg)
  ladeEvents(client, klassenliste)
  ladeOrdner(client, klassenliste)
  ladeCronjobs(client, klassenliste)
  ladeCommands(client)
}
// Initialisierung der Bot Events
function ladeEvents(client, klassenliste) {
  const pfad = `${process.cwd()}/Javascript/events/`
  fs.readdirSync(pfad).forEach((file) => {
    console.log(`${client.user.username} Lade Event "${file}"...`)
    const event = require(`${pfad}${file}`)
    event(client, klassenliste)
    console.log(`${client.user.username} Event "${file}" geladen!`)
  })
}
// Initialisierung der Ordner
function ladeOrdner(client, klassenliste) {
  console.log(`${client.user.username} Überprüfe ob Ordner vorhanden sind...`)
  for (const klasse in klassenliste)
    ordner(klasse)

  console.log(`${client.user.username} Ordner Vorhanden!`)
}
// Initialisierung der Cronjobs
function ladeCronjobs(client, klassenliste) {
  console.log(`${client.user.username} Plane Cronjobs...`)
  cronjob(client, klassenliste)
  console.log(`${client.user.username} Cronjobs geplannt!`)
}

// Initialisierung der Klassen
function erstelleKlassenzimmer(client, cfg) {
  const klassenliste = {}
  console.log(`${client.user.username} Erstelle Klassenzimmer...`)

  for (const name in cfg)
    klassenliste[name] = new Klassenzimmer(name, cfg[name], client)

  console.log(`${client.user.username} Klassenzimmer erstellt!`)
  return klassenliste
}
// Initialisierung der Commands
function ladeCommands(client) {
  console.log(`${client.user.username} Registriere Commands...`)
  deploycmd(client)
  console.log(`${client.user.username} Commands Registriert!`)
}

module.exports = initialisierung
