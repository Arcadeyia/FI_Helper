const fs = require('node:fs')
const process = require('node:process')
const ordner = require('../functions/erstelleordner')
const cronjob = require('../cronjob/stundenplan.js')

function initialisierung(client, klassenliste) {
  ladeEvents(client)
  ladeOrdner(client, klassenliste)
  ladeCronjobs(client, klassenliste)
}

function ladeEvents(client) {
  const pfad = `${process.cwd()}/Javascript/events/`
  fs.readdirSync(pfad).forEach((file) => {
    console.log(`${client.user.username} Lade Event "file"...`)
    const event = require(`${pfad}${file}`)
    event(client)
    console.log(`${client.user.username} Event "file" geladen!`)
  })
}

function ladeOrdner(client, klassenliste) {
  console.log(`${client.user.username} Überprüfe ob Ordner vorhanden sind...`)
  for (const klasse of klassenliste)
    ordner(klasse)

  console.log(`${client.user.username} Ordner Vorhanden!`)
}

function ladeCronjobs(client, klassenliste) {
  cronjob(client, klassenliste)
}

module.exports = initialisierung
