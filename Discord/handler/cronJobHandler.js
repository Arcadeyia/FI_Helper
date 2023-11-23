const cron = require('node-cron')
const cj = require('consolji')
const schedule = require('../schedulers/stundenplan.js')
const config = require('../utils/config.js')

function initializeCronJobs(client) {
  cron.schedule('*/30 * * * * *', () => {
    cj.log('Starte meine Arbeit 🏗️....')
    const cur_week = getCurrentWeek()
    cj.log('Lade Stundenpläne...')

    Object.entries(config.klassen).forEach(([klassenName, klassenConfig]) => {
      schedule.downloadSchedules(klassenName, cur_week)
        .then((path) => {
          if (path) {
            cj.log(`Versuche, Stundenplan zu senden für: ${klassenName}`)
            client.channels.cache.get(klassenConfig.stundenplanChannelId).send({
              content: `Neuer Stundenplan verfügbar!`,
              files: [path],
            }).catch((error) => {
              console.error(`Fehler beim Senden der Nachricht für ${klassenName}: ${error}`)
            })
          }
          else {
            cj.log(`Keine Änderung im Stundenplan für ${klassenName}.`)
          }
        })
        .catch((error) => {
          console.error(`Fehler beim Herunterladen des Stundenplans für ${klassenName}: ${error}`)
        })
    })

    cj.log('Arbeit beendet 🏡')
  })
}

module.exports = initializeCronJobs

function getCurrentWeek() {
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), 0, 1)
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)

  return weekNumber
}
